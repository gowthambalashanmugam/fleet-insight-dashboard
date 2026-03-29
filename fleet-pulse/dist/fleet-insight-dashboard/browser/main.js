import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideRouter,
  withComponentInputBinding
} from "./chunk-MRBZA7NG.js";
import {
  HttpClient,
  HttpResponse,
  provideHttpClient,
  withInterceptors
} from "./chunk-POWEUBQA.js";
import {
  Component,
  HostListener,
  Injectable,
  catchError,
  computed,
  delay,
  effect,
  finalize,
  inject,
  of,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  setClassMetadata,
  signal,
  switchMap,
  tap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-VPHX5FPC.js";

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  ACCESS_TOKEN_KEY = "fleet_access_token";
  REFRESH_TOKEN_KEY = "fleet_refresh_token";
  USER_KEY = "fleet_user";
  http = inject(HttpClient);
  router = inject(Router);
  _accessToken = signal(this.stored(this.ACCESS_TOKEN_KEY), ...ngDevMode ? [{ debugName: "_accessToken" }] : []);
  _refreshToken = signal(this.stored(this.REFRESH_TOKEN_KEY), ...ngDevMode ? [{ debugName: "_refreshToken" }] : []);
  _user = signal(this.storedUser(), ...ngDevMode ? [{ debugName: "_user" }] : []);
  /** Current access token */
  token = this._accessToken.asReadonly();
  /** Current refresh token */
  refreshToken = this._refreshToken.asReadonly();
  /** Current user */
  user = this._user.asReadonly();
  /** Whether the user is authenticated */
  isAuthenticated = computed(() => !!this._accessToken(), ...ngDevMode ? [{ debugName: "isAuthenticated" }] : []);
  /** User initials for avatar */
  initials = computed(() => {
    const u = this._user();
    if (!u)
      return "";
    return (u.firstName.charAt(0) + u.lastName.charAt(0)).toUpperCase();
  }, ...ngDevMode ? [{ debugName: "initials" }] : []);
  /** Full display name */
  displayName = computed(() => {
    const u = this._user();
    if (!u)
      return "";
    return `${u.firstName} ${u.lastName}`;
  }, ...ngDevMode ? [{ debugName: "displayName" }] : []);
  /**
   * Login — stores both tokens + user info.
   * In production this calls POST /api/auth/login and receives tokens from the server.
   */
  login(username, _password) {
    const mockAccess = btoa(`access:${username}:${Date.now()}`);
    const mockRefresh = btoa(`refresh:${username}:${Date.now()}`);
    const [firstName, lastName] = this.parseNameFromUsername(username);
    const user = { username, firstName, lastName };
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
  refreshAccessToken() {
    const currentRefresh = this._refreshToken();
    const body = { refreshToken: currentRefresh ?? "" };
    return this.http.post("/api/auth/refresh", body).pipe(tap((tokens) => this.setTokens(tokens)));
  }
  /** Update stored tokens (called after login or refresh) */
  setTokens(tokens) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    this._accessToken.set(tokens.accessToken);
    this._refreshToken.set(tokens.refreshToken);
  }
  /** Clear everything and redirect to login */
  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    this.router.navigate(["/login"]);
  }
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }
  stored(key) {
    return localStorage.getItem(key);
  }
  storedUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw)
      return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  parseNameFromUsername(username) {
    const parts = username.split(/[.\s_-]+/);
    const first = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Fleet";
    const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : "User";
    return [first, last];
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  STORAGE_KEY = "fleet_theme";
  isDark = signal(this.getStoredTheme(), ...ngDevMode ? [{ debugName: "isDark" }] : []);
  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem(this.STORAGE_KEY, dark ? "dark" : "light");
    });
  }
  toggle() {
    this.isDark.update((v) => !v);
  }
  getStoredTheme() {
    return localStorage.getItem(this.STORAGE_KEY) === "dark";
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/layout/header/header.component.ts
function HeaderComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 5);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function HeaderComponent_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 12);
    \u0275\u0275domElement(1, "circle", 17)(2, "path", 18);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(3, "span");
    \u0275\u0275text(4, "Light Mode");
    \u0275\u0275domElementEnd();
  }
}
function HeaderComponent_Conditional_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 12);
    \u0275\u0275domElement(1, "path", 19);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(2, "span");
    \u0275\u0275text(3, "Dark Mode");
    \u0275\u0275domElementEnd();
  }
}
function HeaderComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 8)(1, "button", 9);
    \u0275\u0275domListener("click", function HeaderComponent_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onToggleTheme());
    });
    \u0275\u0275conditionalCreate(2, HeaderComponent_Conditional_10_Conditional_2_Template, 5, 0)(3, HeaderComponent_Conditional_10_Conditional_3_Template, 4, 0);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElement(4, "div", 10);
    \u0275\u0275domElementStart(5, "button", 11);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(6, "svg", 12);
    \u0275\u0275domElement(7, "circle", 13)(8, "path", 14);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(9, "span");
    \u0275\u0275text(10, "Settings");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElement(11, "div", 10);
    \u0275\u0275domElementStart(12, "button", 15);
    \u0275\u0275domListener("click", function HeaderComponent_Conditional_10_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onLogout());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(13, "svg", 12);
    \u0275\u0275domElement(14, "path", 16);
    \u0275\u0275domElementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(15, "span");
    \u0275\u0275text(16, "Logout");
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.theme.isDark() ? 2 : 3);
  }
}
var HeaderComponent = class _HeaderComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  dropdownOpen = signal(false, ...ngDevMode ? [{ debugName: "dropdownOpen" }] : []);
  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }
  onLogout() {
    this.dropdownOpen.set(false);
    this.auth.logout();
  }
  onToggleTheme() {
    this.theme.toggle();
  }
  onDocumentClick(event) {
    const target = event.target;
    if (!target.closest(".profile-menu")) {
      this.dropdownOpen.set(false);
    }
  }
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], hostBindings: function HeaderComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("click", function HeaderComponent_click_HostBindingHandler($event) {
        return ctx.onDocumentClick($event);
      }, \u0275\u0275resolveDocument);
    }
  }, decls: 11, vars: 6, consts: [[1, "flex", "h-16", "items-center", "justify-between", "border-b", "px-6", 2, "background-color", "var(--color-bg-card)", "border-color", "var(--color-border)"], [1, "text-lg", "font-semibold", 2, "color", "var(--color-text-primary)"], [1, "profile-menu", "relative"], ["type", "button", "aria-haspopup", "true", 1, "avatar-btn", "flex", "items-center", "gap-2", 3, "click"], [1, "avatar"], [1, "user-name", "hidden", "sm:inline"], ["width", "12", "height", "12", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", 1, "chevron"], ["d", "M6 9l6 6 6-6"], ["role", "menu", 1, "dropdown"], ["type", "button", "role", "menuitem", 1, "dropdown-item", 3, "click"], [1, "dropdown-divider"], ["type", "button", "role", "menuitem", 1, "dropdown-item"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2"], ["cx", "12", "cy", "12", "r", "3"], ["d", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"], ["type", "button", "role", "menuitem", 1, "dropdown-item", "logout", 3, "click"], ["d", "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"], ["cx", "12", "cy", "12", "r", "5"], ["d", "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"], ["d", "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"]], template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "header", 0)(1, "h1", 1);
      \u0275\u0275text(2, "TTS Group Ltd.");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 2)(4, "button", 3);
      \u0275\u0275domListener("click", function HeaderComponent_Template_button_click_4_listener() {
        return ctx.toggleDropdown();
      });
      \u0275\u0275domElementStart(5, "div", 4);
      \u0275\u0275text(6);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(7, HeaderComponent_Conditional_7_Template, 2, 1, "span", 5);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(8, "svg", 6);
      \u0275\u0275domElement(9, "path", 7);
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(10, HeaderComponent_Conditional_10_Template, 17, 1, "div", 8);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-expanded", ctx.dropdownOpen());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.auth.initials() || "GB", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.auth.displayName()) ? 7 : -1, tmp_2_0);
      \u0275\u0275advance();
      \u0275\u0275classProp("rotate", ctx.dropdownOpen());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.dropdownOpen() ? 10 : -1);
    }
  }, styles: ["\n\n.avatar-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 0.25rem;\n  border-radius: 0.5rem;\n  transition: background 0.15s ease;\n  color: var(--color-text-primary, #111827);\n}\n.avatar-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.04);\n}\n.avatar-btn[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--color-accent, #6366f1);\n  outline-offset: 2px;\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 2.25rem;\n  height: 2.25rem;\n  border-radius: 50%;\n  background: var(--color-accent, #6366f1);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  letter-spacing: 0.025em;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.user-name[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--color-text-primary, #111827);\n}\n.chevron[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary, #6b7280);\n  transition: transform 0.2s ease;\n}\n.chevron.rotate[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.dropdown[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.5rem);\n  right: 0;\n  min-width: 12rem;\n  background: var(--color-bg-card, #fff);\n  border: 1px solid var(--color-border, #e5e7eb);\n  border-radius: 0.75rem;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n  padding: 0.375rem;\n  z-index: 1100;\n  animation: _ngcontent-%COMP%_dropdown-in 0.15s ease;\n}\n@keyframes _ngcontent-%COMP%_dropdown-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.dropdown-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.625rem;\n  width: 100%;\n  padding: 0.5rem 0.75rem;\n  border: none;\n  background: none;\n  border-radius: 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--color-text-primary, #111827);\n  cursor: pointer;\n  transition: background 0.12s ease;\n}\n.dropdown-item[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary, #6b7280);\n  flex-shrink: 0;\n}\n.dropdown-item[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.04);\n}\n.dropdown-item[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--color-accent, #6366f1);\n  outline-offset: -2px;\n}\n.dropdown-item.logout[_ngcontent-%COMP%] {\n  color: #ef4444;\n}\n.dropdown-item.logout[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: #ef4444;\n}\n.dropdown-divider[_ngcontent-%COMP%] {\n  height: 1px;\n  background: var(--color-border, #e5e7eb);\n  margin: 0.25rem 0.75rem;\n}\n/*# sourceMappingURL=header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderComponent, [{
    type: Component,
    args: [{ selector: "app-header", template: `<header class="flex h-16 items-center justify-between border-b px-6"
  style="background-color: var(--color-bg-card); border-color: var(--color-border);">
  <h1 class="text-lg font-semibold" style="color: var(--color-text-primary)">TTS Group Ltd.</h1>

  <div class="profile-menu relative">
    <button
      type="button"
      class="avatar-btn flex items-center gap-2"
      [attr.aria-expanded]="dropdownOpen()"
      aria-haspopup="true"
      (click)="toggleDropdown()"
    >
      <div class="avatar">
        {{ auth.initials() || 'GB' }}
      </div>
      @if (auth.displayName(); as name) {
        <span class="user-name hidden sm:inline">{{ name }}</span>
      }
      <svg class="chevron" [class.rotate]="dropdownOpen()" width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    @if (dropdownOpen()) {
      <div class="dropdown" role="menu">
        <!-- Theme toggle -->
        <button type="button" class="dropdown-item" role="menuitem" (click)="onToggleTheme()">
          @if (theme.isDark()) {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <span>Light Mode</span>
          } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            <span>Dark Mode</span>
          }
        </button>

        <div class="dropdown-divider"></div>

        <!-- Settings -->
        <button type="button" class="dropdown-item" role="menuitem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </button>

        <div class="dropdown-divider"></div>

        <!-- Logout -->
        <button type="button" class="dropdown-item logout" role="menuitem" (click)="onLogout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    }
  </div>
</header>
`, styles: ["/* src/app/layout/header/header.component.scss */\n.avatar-btn {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 0.25rem;\n  border-radius: 0.5rem;\n  transition: background 0.15s ease;\n  color: var(--color-text-primary, #111827);\n}\n.avatar-btn:hover {\n  background: rgba(0, 0, 0, 0.04);\n}\n.avatar-btn:focus-visible {\n  outline: 2px solid var(--color-accent, #6366f1);\n  outline-offset: 2px;\n}\n.avatar {\n  width: 2.25rem;\n  height: 2.25rem;\n  border-radius: 50%;\n  background: var(--color-accent, #6366f1);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.8125rem;\n  font-weight: 700;\n  letter-spacing: 0.025em;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.user-name {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--color-text-primary, #111827);\n}\n.chevron {\n  color: var(--color-text-secondary, #6b7280);\n  transition: transform 0.2s ease;\n}\n.chevron.rotate {\n  transform: rotate(180deg);\n}\n.dropdown {\n  position: absolute;\n  top: calc(100% + 0.5rem);\n  right: 0;\n  min-width: 12rem;\n  background: var(--color-bg-card, #fff);\n  border: 1px solid var(--color-border, #e5e7eb);\n  border-radius: 0.75rem;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n  padding: 0.375rem;\n  z-index: 1100;\n  animation: dropdown-in 0.15s ease;\n}\n@keyframes dropdown-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.dropdown-item {\n  display: flex;\n  align-items: center;\n  gap: 0.625rem;\n  width: 100%;\n  padding: 0.5rem 0.75rem;\n  border: none;\n  background: none;\n  border-radius: 0.5rem;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: var(--color-text-primary, #111827);\n  cursor: pointer;\n  transition: background 0.12s ease;\n}\n.dropdown-item svg {\n  color: var(--color-text-secondary, #6b7280);\n  flex-shrink: 0;\n}\n.dropdown-item:hover {\n  background: rgba(0, 0, 0, 0.04);\n}\n.dropdown-item:focus-visible {\n  outline: 2px solid var(--color-accent, #6366f1);\n  outline-offset: -2px;\n}\n.dropdown-item.logout {\n  color: #ef4444;\n}\n.dropdown-item.logout svg {\n  color: #ef4444;\n}\n.dropdown-divider {\n  height: 1px;\n  background: var(--color-border, #e5e7eb);\n  margin: 0.25rem 0.75rem;\n}\n/*# sourceMappingURL=header.component.css.map */\n"] }]
  }], null, { onDocumentClick: [{
    type: HostListener,
    args: ["document:click", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/layout/header/header.component.ts", lineNumber: 10 });
})();

// src/app/layout/sidebar/sidebar.component.ts
var _forTrack0 = ($index, $item) => $item.route;
function SidebarComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 4)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", item_r1.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
var SidebarComponent = class _SidebarComponent {
  navItems = signal([
    { label: "Dashboard", route: "/dashboard", icon: "\u{1F4CA}" },
    { label: "Fleet", route: "/fleet", icon: "\u{1F69B}" },
    { label: "Settings", route: "/settings", icon: "\u2699\uFE0F" }
  ], ...ngDevMode ? [{ debugName: "navItems" }] : []);
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], decls: 7, vars: 0, consts: [[1, "flex", "w-64", "flex-col", "border-r", "border-gray-200", "bg-white"], [1, "flex", "h-16", "items-center", "px-6", "border-b", "border-gray-200"], [1, "text-xl", "font-bold", "text-indigo-600"], [1, "flex-1", "space-y-1", "px-3", "py-4"], ["routerLinkActive", "bg-indigo-50 text-indigo-600", 1, "flex", "items-center", "gap-3", "rounded-lg", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:bg-gray-50", 3, "routerLink"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275text(3, "FleetInsight");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "nav", 3);
      \u0275\u0275repeaterCreate(5, SidebarComponent_For_6_Template, 5, 3, "a", 4, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.navItems());
    }
  }, dependencies: [RouterLink, RouterLinkActive], styles: ["\n\n/*# sourceMappingURL=sidebar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{ selector: "app-sidebar", imports: [RouterLink, RouterLinkActive], template: '<aside class="flex w-64 flex-col border-r border-gray-200 bg-white">\n  <div class="flex h-16 items-center px-6 border-b border-gray-200">\n    <span class="text-xl font-bold text-indigo-600">FleetInsight</span>\n  </div>\n  <nav class="flex-1 space-y-1 px-3 py-4">\n    @for (item of navItems(); track item.route) {\n      <a\n        [routerLink]="item.route"\n        routerLinkActive="bg-indigo-50 text-indigo-600"\n        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"\n      >\n        <span>{{ item.icon }}</span>\n        <span>{{ item.label }}</span>\n      </a>\n    }\n  </nav>\n</aside>\n', styles: ["/* src/app/layout/sidebar/sidebar.component.scss */\n/*# sourceMappingURL=sidebar.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/layout/sidebar/sidebar.component.ts", lineNumber: 16 });
})();

// src/app/layout/shell/shell.component.ts
var ShellComponent = class _ShellComponent {
  static \u0275fac = function ShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShellComponent, selectors: [["app-shell"]], decls: 6, vars: 0, consts: [[1, "flex", "h-screen", "overflow-hidden", "bg-gray-100"], [1, "flex", "flex-1", "flex-col", "overflow-hidden"], [1, "flex-1", "overflow-y-auto", "p-6"]], template: function ShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-sidebar");
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275element(3, "app-header");
      \u0275\u0275elementStart(4, "main", 2);
      \u0275\u0275element(5, "router-outlet");
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [RouterOutlet, HeaderComponent, SidebarComponent], styles: ["\n\n/*# sourceMappingURL=shell.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShellComponent, [{
    type: Component,
    args: [{ selector: "app-shell", imports: [RouterOutlet, HeaderComponent, SidebarComponent], template: '<div class="flex h-screen overflow-hidden bg-gray-100">\n  <app-sidebar />\n  <div class="flex flex-1 flex-col overflow-hidden">\n    <app-header />\n    <main class="flex-1 overflow-y-auto p-6">\n      <router-outlet />\n    </main>\n  </div>\n</div>\n', styles: ["/* src/app/layout/shell/shell.component.scss */\n/*# sourceMappingURL=shell.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/layout/shell/shell.component.ts", lineNumber: 12 });
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "login",
    loadComponent: () => import("./chunk-GI4ZJS4B.js").then((m) => m.LoginComponent)
  },
  {
    path: "",
    component: ShellComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        loadComponent: () => import("./chunk-JAYDHKAH.js").then((m) => m.DashboardComponent)
      },
      {
        path: "fleet",
        loadComponent: () => import("./chunk-6RQP63YI.js").then((m) => m.FleetComponent)
      },
      {
        path: "settings",
        loadComponent: () => import("./chunk-HBJ4R7OY.js").then((m) => m.SettingsComponent)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

// src/app/core/interceptors/request.interceptor.ts
var requestInterceptor = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const isAuthEndpoint = req.url.includes("/auth/login") || req.url.includes("/auth/refresh");
  if (!token || isAuthEndpoint) {
    return next(req);
  }
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq);
};

// src/app/core/services/loading.service.ts
var LoadingService = class _LoadingService {
  activeRequests = signal(0, ...ngDevMode ? [{ debugName: "activeRequests" }] : []);
  /** True when at least one HTTP request is in flight */
  isLoading = computed(() => this.activeRequests() > 0, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  start() {
    this.activeRequests.update((n) => n + 1);
  }
  stop() {
    this.activeRequests.update((n) => Math.max(0, n - 1));
  }
  static \u0275fac = function LoadingService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoadingService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LoadingService, factory: _LoadingService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoadingService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/interceptors/loading.interceptor.ts
var loadingInterceptor = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.start();
  return next(req).pipe(finalize(() => loadingService.stop()));
};

// src/app/core/interceptors/mock-api.interceptor.ts
var mockApiInterceptor = (req, next) => {
  const url = req.url;
  if (req.method === "GET" && url.endsWith("/api/vehicles")) {
    return of(new HttpResponse({ status: 200, body: MOCK_VEHICLES })).pipe(delay(200));
  }
  if (req.method === "GET" && url.endsWith("/api/trips")) {
    return of(new HttpResponse({ status: 200, body: MOCK_TRIPS })).pipe(delay(200));
  }
  if (req.method === "GET" && url.endsWith("/api/alerts")) {
    return of(new HttpResponse({ status: 200, body: MOCK_ALERTS })).pipe(delay(200));
  }
  if (req.method === "POST" && url.endsWith("/api/auth/login")) {
    const body = req.body;
    if (body?.username && body?.password) {
      const response = {
        accessToken: btoa(`access:${body.username}:${Date.now()}`),
        refreshToken: btoa(`refresh:${body.username}:${Date.now()}`),
        user: { username: body.username }
      };
      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(300));
    }
    return of(new HttpResponse({ status: 401, body: { message: "Invalid credentials" } }));
  }
  if (req.method === "POST" && url.endsWith("/api/auth/refresh")) {
    const body = req.body;
    if (body?.refreshToken) {
      const response = {
        accessToken: btoa(`access:refreshed:${Date.now()}`),
        refreshToken: btoa(`refresh:refreshed:${Date.now()}`)
      };
      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(200));
    }
    return of(new HttpResponse({ status: 401, body: { message: "Invalid refresh token" } }));
  }
  return next(req);
};
var SWEDISH_CITIES = [
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "Gothenburg", lat: 57.71, lng: 11.97 },
  { name: "Malm\xF6", lat: 55.6, lng: 13 },
  { name: "Uppsala", lat: 59.86, lng: 17.64 },
  { name: "Link\xF6ping", lat: 58.41, lng: 15.63 },
  { name: "\xD6rebro", lat: 59.27, lng: 15.21 },
  { name: "V\xE4ster\xE5s", lat: 59.61, lng: 16.55 },
  { name: "Helsingborg", lat: 56.05, lng: 12.69 },
  { name: "Norrk\xF6ping", lat: 58.59, lng: 16.18 },
  { name: "J\xF6nk\xF6ping", lat: 57.78, lng: 14.16 },
  { name: "Ume\xE5", lat: 63.83, lng: 20.26 },
  { name: "Lund", lat: 55.7, lng: 13.19 },
  { name: "Bor\xE5s", lat: 57.72, lng: 12.94 },
  { name: "Sundsvall", lat: 62.39, lng: 17.31 },
  { name: "G\xE4vle", lat: 60.67, lng: 17.15 },
  { name: "Karlstad", lat: 59.38, lng: 13.5 },
  { name: "Lule\xE5", lat: 65.58, lng: 22.15 },
  { name: "V\xE4xj\xF6", lat: 56.88, lng: 14.81 }
];
var V_STATUSES = ["Active", "Idle", "Maintenance"];
var MOCK_VEHICLES = SWEDISH_CITIES.map((city, i) => {
  const status = V_STATUSES[i % V_STATUSES.length];
  return {
    id: `VH-${String(i + 1).padStart(3, "0")}`,
    name: `Truck ${city.name}`,
    registration: `SFM ${100 + i}`,
    status,
    latitude: city.lat + (Math.random() - 0.5) * 0.1,
    longitude: city.lng + (Math.random() - 0.5) * 0.1,
    speed: status === "Active" ? Math.round(40 + Math.random() * 80) : 0,
    fuelLevel: Math.round(10 + Math.random() * 90)
  };
});
var DRIVERS = [
  { name: "Erik Lindqvist", avatarUrl: "https://i.pravatar.cc/40?u=erik" },
  { name: "Anna Svensson", avatarUrl: "https://i.pravatar.cc/40?u=anna" },
  { name: "Lars Johansson", avatarUrl: "https://i.pravatar.cc/40?u=lars" },
  { name: "Maria Karlsson", avatarUrl: "https://i.pravatar.cc/40?u=maria" },
  { name: "Oskar Nilsson", avatarUrl: "https://i.pravatar.cc/40?u=oskar" },
  { name: "Sofia Andersson", avatarUrl: "https://i.pravatar.cc/40?u=sofia" },
  { name: "Gustav Pettersson", avatarUrl: "https://i.pravatar.cc/40?u=gustav" },
  { name: "Elin Bergstr\xF6m", avatarUrl: "https://i.pravatar.cc/40?u=elin" }
];
var DESTINATIONS = [
  "Stockholm",
  "Gothenburg",
  "Malm\xF6",
  "Uppsala",
  "Link\xF6ping",
  "\xD6rebro",
  "V\xE4ster\xE5s",
  "Helsingborg",
  "Norrk\xF6ping",
  "J\xF6nk\xF6ping"
];
var T_STATUSES = ["Ongoing", "Done", "Cancelled"];
var MOCK_TRIPS = Array.from({ length: 10 }, (_, i) => {
  const driver = DRIVERS[i % DRIVERS.length];
  const hours = Math.floor(1 + Math.random() * 5);
  const minutes = Math.floor(Math.random() * 60);
  return {
    id: `TR-${String(i + 1).padStart(3, "0")}`,
    tripNumber: `TRIP-${2024e3 + i + 1}`,
    driver,
    vehicle: {
      name: `Truck ${DESTINATIONS[i % DESTINATIONS.length]}`,
      registration: `SFM ${100 + i}`
    },
    destination: DESTINATIONS[(i + 3) % DESTINATIONS.length],
    duration: `${hours}h ${minutes}m`,
    status: T_STATUSES[i % T_STATUSES.length]
  };
});
var ALERT_LOCATIONS = [
  { lat: 59.35, lng: 18.1, city: "Stockholm" },
  { lat: 57.7, lng: 11.95, city: "Gothenburg" },
  { lat: 55.62, lng: 13.02, city: "Malm\xF6" },
  { lat: 63.82, lng: 20.3, city: "Ume\xE5" },
  { lat: 65.6, lng: 22.13, city: "Lule\xE5" }
];
var A_SEVERITIES = ["low", "medium", "high"];
var MESSAGES = [
  "Engine temperature warning",
  "Low fuel alert",
  "Speeding detected",
  "Maintenance overdue",
  "Tire pressure low"
];
var MOCK_ALERTS = ALERT_LOCATIONS.map((loc, i) => ({
  id: `AL-${String(i + 1).padStart(3, "0")}`,
  vehicleId: `VH-${String(i + 1).padStart(3, "0")}`,
  latitude: loc.lat,
  longitude: loc.lng,
  severity: A_SEVERITIES[i % A_SEVERITIES.length],
  message: MESSAGES[i % MESSAGES.length]
}));

// src/app/core/services/notification.service.ts
var NotificationService = class _NotificationService {
  nextId = 0;
  _notifications = signal([], ...ngDevMode ? [{ debugName: "_notifications" }] : []);
  notifications = this._notifications.asReadonly();
  success(message) {
    this.add(message, "success");
  }
  error(message) {
    this.add(message, "error");
  }
  info(message) {
    this.add(message, "info");
  }
  warning(message) {
    this.add(message, "warning");
  }
  dismiss(id) {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }
  add(message, type, duration = 5e3) {
    const id = this.nextId++;
    this._notifications.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }
  static \u0275fac = function NotificationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationService, factory: _NotificationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/core/interceptors/response.interceptor.ts
var isRefreshing = false;
var responseInterceptor = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);
  return next(req).pipe(catchError((error) => {
    if (req.url.includes("/auth/login") || req.url.includes("/auth/refresh")) {
      return throwError(() => error);
    }
    if (error.status === 401 || error.status === 403) {
      return handleTokenExpiry(req, next, auth, notify, error);
    }
    if (error.status >= 500) {
      notify.error("Server error. Please try again later.");
    }
    if (error.status === 0) {
      notify.error("Network error. Check your connection.");
    }
    return throwError(() => error);
  }));
};
function handleTokenExpiry(req, next, auth, notify, originalError) {
  const refreshToken = auth.refreshToken();
  if (!refreshToken) {
    notify.error("Session expired. Please log in again.");
    auth.logout();
    return throwError(() => originalError);
  }
  if (isRefreshing) {
    notify.error("Session expired. Please log in again.");
    auth.logout();
    return throwError(() => originalError);
  }
  isRefreshing = true;
  return auth.refreshAccessToken().pipe(switchMap(() => {
    isRefreshing = false;
    const retryReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.token()}`
      }
    });
    return next(retryReq);
  }), catchError((refreshError) => {
    isRefreshing = false;
    notify.error("Session expired. Please log in again.");
    auth.logout();
    return throwError(() => refreshError);
  }));
}

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      requestInterceptor,
      // 1. Attach JWT access token to outgoing requests
      loadingInterceptor,
      // 2. Track in-flight requests for global loading state
      mockApiInterceptor,
      // 3. Intercept /api/* and return mock JSON (REMOVE for real APIs)
      responseInterceptor
      // 4. Handle responses: 401/403 refresh flow, 500, network errors
    ]))
  ]
};

// src/app/app.ts
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], styles: ["\n\n/*# sourceMappingURL=app.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", imports: [RouterOutlet], template: "<router-outlet />\n", styles: ["/* src/app/app.scss */\n/*# sourceMappingURL=app.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 10 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
