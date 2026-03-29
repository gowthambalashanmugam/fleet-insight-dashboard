import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * REQUEST interceptor — runs on every outgoing HTTP request.
 *
 * Responsibilities:
 *  - Attach JWT access token as Authorization: Bearer header
 *  - Skip auth endpoints (login, refresh) to avoid circular calls
 */
export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const isAuthEndpoint =
    req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  if (!token || isAuthEndpoint) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
