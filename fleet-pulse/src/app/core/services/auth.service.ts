import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../models/api.model';

export interface AuthUser {
  username: string;
  firstName: string;
  lastName: string;
}

/**
 * Signal-based auth state management with JWT access + refresh tokens.
 *
 * - accessToken: short-lived, attached to every API request by authInterceptor
 * - refreshToken: long-lived, used to obtain a new accessToken when the current one expires
 *
 * On 401/403 the response interceptor calls refreshAccessToken().
 * If refresh fails → logout → redirect to /login.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'fleet_access_token';
  private readonly REFRESH_TOKEN_KEY = 'fleet_refresh_token';
  private readonly USER_KEY = 'fleet_user';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _accessToken = signal<string | null>(this.stored(this.ACCESS_TOKEN_KEY));
  private readonly _refreshToken = signal<string | null>(this.stored(this.REFRESH_TOKEN_KEY));
  private readonly _user = signal<AuthUser | null>(this.storedUser());

  /** Current access token */
  readonly token = this._accessToken.asReadonly();

  /** Current refresh token */
  readonly refreshToken = this._refreshToken.asReadonly();

  /** Current user */
  readonly user = this._user.asReadonly();

  /** Whether the user is authenticated */
  readonly isAuthenticated = computed(() => !!this._accessToken());

  /** User initials for avatar */
  readonly initials = computed(() => {
    const u = this._user();
    if (!u) return '';
    return (u.firstName.charAt(0) + u.lastName.charAt(0)).toUpperCase();
  });

  /** Full display name */
  readonly displayName = computed(() => {
    const u = this._user();
    if (!u) return '';
    return `${u.firstName} ${u.lastName}`;
  });

  /**
   * Login — stores both tokens + user info.
   * In production this calls POST /api/auth/login and receives tokens from the server.
   */
  login(username: string, _password: string): void {
    const mockAccess = btoa(`access:${username}:${Date.now()}`);
    const mockRefresh = btoa(`refresh:${username}:${Date.now()}`);
    const [firstName, lastName] = this.parseNameFromUsername(username);
    const user: AuthUser = { username, firstName, lastName };

    this.setTokens({ accessToken: mockAccess, refreshToken: mockRefresh });
    this.setUser(user);
  }

  /**
   * Attempt to refresh the access token using the stored refresh token.
   * Returns an Observable so the interceptor can retry the failed request.
   *
   * In production: POST /api/auth/refresh { refreshToken }
   * The server validates the refresh token and returns new tokens.
   */
  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const currentRefresh = this._refreshToken();
    const body: RefreshTokenRequest = { refreshToken: currentRefresh ?? '' };

    return this.http
      .post<RefreshTokenResponse>('/api/auth/refresh', body)
      .pipe(
        tap((tokens) => this.setTokens(tokens))
      );
  }

  /** Update stored tokens (called after login or refresh) */
  setTokens(tokens: RefreshTokenResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    this._accessToken.set(tokens.accessToken);
    this._refreshToken.set(tokens.refreshToken);
  }

  /** Clear everything and redirect to login */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  private stored(key: string): string | null {
    return localStorage.getItem(key);
  }

  private storedUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  private parseNameFromUsername(username: string): [string, string] {
    const parts = username.split(/[.\s_-]+/);
    const first = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Fleet';
    const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'User';
    return [first, last];
  }
}
