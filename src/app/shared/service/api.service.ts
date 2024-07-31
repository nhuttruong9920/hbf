import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string;
  accessToken: string = '';
  httpHeaders!: HttpHeaders;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.baseUrl = baseUrl ?? '';
    // this.accessToken = `Bearer ${authService.accessToken}`;
    this.httpHeaders = new HttpHeaders({
      Authorization: this.accessToken,
    });
  }

  post(
    url: string,
    body?: any | Record<string, never>,
    params?: { [key: string]: any }
  ): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    return this.http.post(`${this.baseUrl}${url}`, body, {
      headers: this.httpHeaders,
      params: httpParams,
      observe: 'response' as 'response',
    });
  }

  get(url: String, params?: { [key: string]: any }): Observable<any> {
    let httpParams = new HttpParams();

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
    return this.http.get(this.baseUrl + url, {
      headers: this.httpHeaders,
      params: httpParams,
    });
  }

  put(
    url: String,
    body?: any,
    params?: { [key: string]: any }
  ): Observable<any> {
    let httpParams = new HttpParams();

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }

    return this.http.put(this.baseUrl + url, body, {
      headers: this.httpHeaders,
      params: httpParams,
    });
  }

  delete(url: String): Observable<any> {
    return this.http.delete(this.baseUrl + url, {
      headers: this.httpHeaders,
    });
  }
}
