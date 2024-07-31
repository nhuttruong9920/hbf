import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL } from '@shared/service/api.service';
import { LocalStorageService } from '@shared/service/local-storage.service';

import { catchError, firstValueFrom, Observable, of, switchMap } from 'rxjs';

export type UserInfo = {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  jti: string;
  nbf: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl!: string;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.baseUrl = baseUrl ?? '';
  }

  login(body: { phone: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, body);
  }

  afterLogin(accessToken: string, refreshToken: string, phone: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setPhone(phone);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.localStorageService.remove('access_token');
    this.localStorageService.remove('refresh_token');
    this.localStorageService.remove('phone');
    this.router.navigate(['/login']);
  }

  handleReFreshToken(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return of(false);
    }
    return this.http
      .post(`${this.baseUrl}/refresh`, `\"${refreshToken}\"`)
      .pipe(
        switchMap((res: any) => {
          if (!res.error) {
            this.setAccessToken(res.data.accessToken);
            this.setRefreshToken(res.data.refreshToken);
            this.setPhone(this.phone);
            return of(true);
          } else {
            return of(false);
          }
        }),
        catchError((err) => {
          return of(false);
        })
      );
  }

  async tryRefreshToken(): Promise<boolean> {
    try {
      const result = await firstValueFrom(this.handleReFreshToken());
      return result;
    } catch (error) {
      return false;
    }
  }

  setAccessToken(accessToken: string): void {
    this.localStorageService.set('access_token', accessToken);
  }

  get accessToken(): string {
    return this.localStorageService.get('access_token') ?? '';
  }

  setRefreshToken(refreshToken: string): void {
    this.localStorageService.set('refresh_token', refreshToken);
  }

  getRefreshToken(): string {
    return this.localStorageService.get('refresh_token') ?? '';
  }

  setPhone(username: string): void {
    this.localStorageService.set('phone', username);
  }

  get phone(): string {
    return this.localStorageService.get('phone') ?? '';
  }

  get user(): UserInfo | null {
    const accessToken = this.accessToken;
    if (!accessToken) {
      return null;
    }

    try {
      const decoded = window.atob(accessToken.split('.')[1]);
      const data = JSON.parse(decoded);

      if (!decoded && !data) {
        return null;
      }

      return {
        aud: data.aud,
        exp: data.exp,
        iat: data.iat,
        iss: data.iss,
        sub: data.sub,
        jti: data.jti,
        nbf: data.nbf,
      };
    } catch (error) {
      return null;
    }
  }

  isAccessTokenExpired(): boolean {
    const user = this.user;
    if (user && !!user === true) {
      return !!user && new Date() > new Date(user.exp * 1000);
    }
    return true;
  }

  isAuthenticated(): boolean {
    return (
      !!this.accessToken &&
      !this.isAccessTokenExpired() &&
      !!this.getRefreshToken()
    );
  }

  handleRefreshToken(): void {
    this.logout();
    this.navigateToLogin();
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
