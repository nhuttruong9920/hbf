import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@core/service/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  if (authService.isAuthenticated() && !authService.isAccessTokenExpired()) {
    return true;
  }
  if (authService.isAccessTokenExpired() && authService.getRefreshToken()) {
    const refreshTokenResult = authService.tryRefreshToken();
    if (!refreshTokenResult) {
      authService.navigateToLogin();
    }
    return refreshTokenResult;
  }

  authService.navigateToLogin();
  return false;
};
