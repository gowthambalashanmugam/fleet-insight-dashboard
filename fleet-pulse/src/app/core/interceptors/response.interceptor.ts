import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * RESPONSE interceptor — runs on every incoming HTTP response.
 *
 * Responsibilities:
 *  - 401/403: attempt token refresh using stored refresh token
 *    → if refresh succeeds: retry original request with new access token
 *    → if refresh fails or no refresh token: logout + navigate to /login
 *  - 500+: show server error notification
 *  - 0 (network): show connectivity error
 *  - Skip auth endpoints to prevent infinite loops
 */

let isRefreshing = false;

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't intercept errors from auth endpoints to avoid loops
      if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      if (error.status === 401 || error.status === 403) {
        return handleTokenExpiry(req, next, auth, notify, error);
      }

      if (error.status >= 500) {
        notify.error('Server error. Please try again later.');
      }

      if (error.status === 0) {
        notify.error('Network error. Check your connection.');
      }

      return throwError(() => error);
    })
  );
};

/**
 * Handles 401/403 by attempting a token refresh.
 *
 * Flow:
 *  1. Check if refresh token exists
 *  2. If no refresh token → logout immediately
 *  3. If already refreshing → logout (prevent concurrent refresh calls)
 *  4. Call POST /api/auth/refresh with the refresh token
 *  5. On success → retry the original failed request with new access token
 *  6. On failure → logout + redirect to /login
 */
function handleTokenExpiry(
  req: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1],
  auth: AuthService,
  notify: NotificationService,
  originalError: HttpErrorResponse
) {
  const refreshToken = auth.refreshToken();

  // No refresh token → can't recover, logout
  if (!refreshToken) {
    notify.error('Session expired. Please log in again.');
    auth.logout();
    return throwError(() => originalError);
  }

  // Already refreshing → avoid concurrent refresh calls
  if (isRefreshing) {
    notify.error('Session expired. Please log in again.');
    auth.logout();
    return throwError(() => originalError);
  }

  isRefreshing = true;

  return auth.refreshAccessToken().pipe(
    switchMap(() => {
      isRefreshing = false;

      // Retry original request with the new access token
      const retryReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${auth.token()}`,
        },
      });

      return next(retryReq);
    }),
    catchError((refreshError) => {
      isRefreshing = false;

      // Refresh failed → token is truly expired
      notify.error('Session expired. Please log in again.');
      auth.logout();
      return throwError(() => refreshError);
    })
  );
}
