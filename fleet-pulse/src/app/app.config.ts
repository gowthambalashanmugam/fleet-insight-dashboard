import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { requestInterceptor } from './core/interceptors/request.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { mockApiInterceptor } from './core/interceptors/mock-api.interceptor';
import { responseInterceptor } from './core/interceptors/response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([
        requestInterceptor,  // 1. Attach JWT access token to outgoing requests
        loadingInterceptor,  // 2. Track in-flight requests for global loading state
        mockApiInterceptor,  // 3. Intercept /api/* and return mock JSON (REMOVE for real APIs)
        responseInterceptor, // 4. Handle responses: 401/403 refresh flow, 500, network errors
      ])
    ),
  ],
};
