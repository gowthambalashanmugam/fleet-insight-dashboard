# 🚛 Fleet Pulse — Fleet Insight Dashboard

A real-time fleet management dashboard built with **Angular 20**, featuring live vehicle tracking, alert management, trip monitoring, and a fully offline-capable architecture powered by **IndexedDB**.

> No backend required — the entire app runs client-side with a mock API interceptor layer, making it instantly runnable and demo-ready.

---

## 🎯 Project Goal

Fleet Pulse is designed to give fleet operators a single-pane-of-glass view into their vehicle operations:

- **Monitor** vehicle locations, statuses, and fuel levels in real time on an interactive map
- **Track** trips with status breakdowns (ongoing, completed, cancelled)
- **Manage** alerts by severity (Critical, Warning, Information) with filtering, sorting, and bulk actions
- **Administer** the fleet — add vehicles, view details, filter by type/status/fuel level
- **Authenticate** users with JWT-based access + refresh token flow

The architecture is built to be production-ready — swap out the mock interceptor for real API endpoints and you're live.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Live Map Tracking** | Interactive Leaflet map with vehicle markers, alert overlays, and custom popups |
| **KPI Dashboard** | Real-time cards showing total, active, idle, and maintenance vehicle counts |
| **Alert Management** | Filter by severity/type, sort by date/severity, bulk select & delete |
| **Fleet Administration** | Vehicle list with search, status/fuel/type filters, pagination, and detail panels |
| **Trip Monitoring** | Trip summary cards with trend indicators + latest trip table |
| **Dark/Light Theme** | CSS custom property-based theming with localStorage persistence |
| **JWT Authentication** | Access + refresh token flow with automatic token refresh on 401/403 |
| **Toast Notifications** | Signal-based notification system with auto-dismiss |
| **Offline-First Storage** | IndexedDB with versioned migrations and automatic seed data |
| **Add Vehicle Modal** | Form with validation and duplicate registration detection |

---

## 🏗️ Architecture & Advanced Features

### Zoneless Change Detection

The app uses `provideZonelessChangeDetection()` — Zone.js is completely removed. All reactivity is driven by Angular Signals (`signal()`, `computed()`, `toSignal()`), resulting in:
- Smaller bundle size (no zone.js polyfill)
- Fine-grained change detection — only bindings that depend on a changed signal are re-evaluated
- Better performance for frequent updates (map markers, real-time data)

### Signal-Based State Management

No external state library. The entire app uses Angular's built-in signals:
- `signal()` for local mutable state (loading, error, filters)
- `computed()` for derived state (KPI counts, filtered vehicles, paginated lists)
- `toSignal()` to bridge RxJS observables into the signal graph
- `input()` / `output()` for component communication (replacing `@Input` / `@Output` decorators)

### HTTP Interceptor Chain

Four functional interceptors wired in a specific order:

```
Request → requestInterceptor → loadingInterceptor → mockApiInterceptor → responseInterceptor → Response
```

| Interceptor | Purpose |
|---|---|
| `requestInterceptor` | Attaches JWT `Authorization: Bearer` header, skips auth endpoints |
| `loadingInterceptor` | Tracks in-flight requests via `LoadingService` signals using `finalize()` |
| `mockApiInterceptor` | Intercepts `/api/*` calls, returns mock responses from IndexedDB |
| `responseInterceptor` | Handles 401/403 (token refresh + retry), 500 (server error), 0 (network error) |

### RxJS Operators Used

| Operator | Where | Purpose |
|---|---|---|
| `switchMap` | Dashboard, Fleet, Alerts | Cancel previous HTTP request on refresh |
| `catchError` | All data streams | Graceful error handling per-stream |
| `startWith` | Refresh subjects | Trigger initial data load |
| `tap` | Data pipelines | Side effects (set loading state) |
| `finalize` | Loading interceptor | Decrement active request count |
| `combineLatest` | Alert service | Merge HTTP + WebSocket streams |
| `interval` | WebSocket fallback | Polling when WebSocket disconnects |
| `from` | Mock interceptor | Convert IndexedDB Promises to Observables |
| `delay` | Mock interceptor | Simulate network latency (~200ms) |

### IndexedDB Persistence

The `IndexedDbService` provides a full offline-capable data layer:
- **Versioned migrations** — `onupgradeneeded` with fall-through switch for schema evolution (v1 → v2 → v3)
- **Auto-seeding** — empty stores are populated with seed data on first load
- **CRUD operations** — `getAll()`, `getById()`, `put()`, `delete()` with proper transaction handling
- **Error resilience** — all operations wrapped in Promises with descriptive error messages

### WebSocket Service with Fallback

Real-time updates via WebSocket with production-grade resilience:
- **Exponential backoff** reconnection (`calculateReconnectDelay` — exported pure function for testability)
- **Max retry limit** (5 attempts) before falling back to HTTP polling
- **Automatic fallback** to 30-second polling interval when WebSocket is unavailable
- **Clean teardown** — proper socket cleanup, timeout clearing, and subscription management

### Web Worker for Map Processing

Heavy marker processing is offloaded to a Web Worker (`map.worker.ts`):
- Vehicle marker HTML generation and alert overlay calculations run off the main thread
- Graceful fallback to main-thread processing if Worker initialization fails
- Keeps the UI responsive even with large vehicle fleets

### Lazy Loading & Deferred Views

- **Route-level lazy loading** — Dashboard, Fleet, Alerts, and Login are all `loadComponent` / `loadChildren`
- **`@defer (on viewport)`** — Trip summary section in the dashboard only loads when scrolled into view
- **`PreloadAllModules`** strategy — lazy chunks are preloaded in the background after initial load
- **Dynamic Leaflet import** — the map library is loaded asynchronously only when the map component renders

### Theme System

CSS custom properties defined in `_colors.scss`:
- `:root` for light theme defaults
- `.dark` class for dark theme overrides
- `ThemeService` with signal-based state + `localStorage` persistence
- `effect()` to sync the `dark` class on `document.documentElement`

---

## 📁 Project Structure

```
fleet-pulse/
├── cypress/                          # E2E tests (Cypress)
│   ├── e2e/
│   │   ├── add-vehicle.cy.ts        # Add vehicle form E2E tests
│   │   ├── alerts.cy.ts             # Alert management E2E tests
│   │   ├── dashboard.cy.ts          # Dashboard E2E tests
│   │   ├── fleet.cy.ts              # Fleet page E2E tests
│   │   ├── login.cy.ts              # Authentication E2E tests
│   │   └── navigation.cy.ts         # Navigation & routing E2E tests
│   └── support/                      # Cypress commands & setup
│
├── src/
│   ├── app/
│   │   ├── core/                     # Singleton services, guards, interceptors, models
│   │   │   ├── data/
│   │   │   │   └── seed-data.ts      # Seed data for IndexedDB (vehicles, trips, alerts)
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts     # Route guard — redirects unauthenticated users to /login
│   │   │   ├── interceptors/
│   │   │   │   ├── loading.interceptor.ts   # Tracks in-flight HTTP requests
│   │   │   │   ├── mock-api.interceptor.ts  # Mock backend — IndexedDB-backed API responses
│   │   │   │   ├── request.interceptor.ts   # Attaches JWT Bearer token to requests
│   │   │   │   └── response.interceptor.ts  # 401 refresh flow, 500/network error handling
│   │   │   ├── models/               # TypeScript interfaces & types
│   │   │   │   ├── alert.model.ts
│   │   │   │   ├── api.model.ts      # Request/Response DTOs for all API endpoints
│   │   │   │   ├── kpi.model.ts
│   │   │   │   ├── marker-config.model.ts
│   │   │   │   ├── trip.model.ts
│   │   │   │   ├── trip-summary.model.ts
│   │   │   │   ├── vehicle.model.ts
│   │   │   │   └── ws-message.model.ts
│   │   │   └── services/
│   │   │       ├── alert-data.service.ts     # Alert HTTP data access
│   │   │       ├── api.service.ts            # Base API service (generic HTTP methods)
│   │   │       ├── auth.service.ts           # JWT auth state — access/refresh tokens, login/logout
│   │   │       ├── dashboard.service.ts      # Dashboard data aggregation
│   │   │       ├── indexed-db.service.ts     # IndexedDB wrapper with versioned migrations
│   │   │       ├── loading.service.ts        # Signal-based global loading state
│   │   │       ├── notification.service.ts   # Toast notification service (signal-based)
│   │   │       ├── theme.service.ts          # Dark/light theme toggle with localStorage
│   │   │       ├── trip-data.service.ts      # Trip HTTP data access
│   │   │       ├── vehicle-data.service.ts   # Vehicle HTTP data access
│   │   │       └── websocket.service.ts      # WebSocket with exponential backoff + polling fallback
│   │   │
│   │   ├── features/                 # Feature modules (lazy-loaded)
│   │   │   ├── alerts/               # Alert management page
│   │   │   │   ├── components/
│   │   │   │   │   ├── alert-card/           # Individual alert card
│   │   │   │   │   ├── alert-filters/        # Severity/type filters + bar chart
│   │   │   │   │   └── alert-header/         # Sort, filter toggle, bulk actions
│   │   │   │   ├── models/                   # Alert-specific view models
│   │   │   │   └── services/
│   │   │   │       ├── alert.service.ts      # Alert state — merges HTTP + WebSocket
│   │   │   │       └── alert.service.spec.ts # Unit tests
│   │   │   │
│   │   │   ├── dashboard/            # Main dashboard page
│   │   │   │   └── components/
│   │   │   │       ├── kpi-card/             # Single KPI metric card
│   │   │   │       ├── kpi-card-list/        # KPI card grid
│   │   │   │       ├── latest-trip-table/    # Recent trips table
│   │   │   │       ├── live-tracking-section/# Map + vehicle list section
│   │   │   │       ├── map/                  # Leaflet map + Web Worker
│   │   │   │       ├── trip-summary-card/    # Trip summary with trend
│   │   │   │       └── trip-summary-card-list/
│   │   │   │
│   │   │   ├── fleet/                # Fleet management page
│   │   │   │   ├── components/
│   │   │   │   │   ├── add-vehicle-form/     # Add vehicle modal form
│   │   │   │   │   ├── fleet-detail-panel/   # Expandable vehicle detail
│   │   │   │   │   └── fleet-filter-bar/     # Search + status/fuel/type filters
│   │   │   │   └── fleet-filter.util.ts      # Pure filter functions
│   │   │   │
│   │   │   └── login/                # Login page
│   │   │
│   │   ├── layout/                   # App shell components
│   │   │   ├── header/               # Top navigation bar
│   │   │   ├── shell/                # Main layout wrapper (header + sidebar + router-outlet)
│   │   │   └── sidebar/              # Side navigation
│   │   │
│   │   └── shared/                   # Reusable components
│   │       └── components/
│   │           ├── card/             # Generic card wrapper
│   │           ├── modal/            # Reusable modal dialog
│   │           ├── pagination/       # Pagination controls
│   │           ├── status-badge/     # Color-coded status badge + unit tests
│   │           └── toast-container/  # Toast notification renderer
│   │
│   └── styles/
│       ├── _colors.scss              # CSS custom properties (light/dark theme tokens)
│       └── _mixins.scss              # Reusable SCSS mixins (card-base, section-header, status-badge)
│
├── angular.json
├── cypress.config.ts
├── karma.conf.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

---

## 🧪 Testing

### Unit Tests (Karma + Jasmine)

```bash
npm test
```

Unit tests cover:
- **Service logic** — `AlertService` (load, merge WebSocket data, delete single/bulk)
- **Component rendering** — `StatusBadgeComponent` (default colors, custom colorMap, unknown status fallback)
- **Zoneless testing** — all tests use `provideZonelessChangeDetection()` and `fixture.whenStable()`
- **Test host pattern** — wrapper components for testing input/output bindings

### E2E Tests (Cypress)

```bash
# Interactive mode
npm run e2e

# Headless CI mode
npm run e2e:headless
```

E2E test coverage:
| Test File | Coverage |
|---|---|
| `login.cy.ts` | Authentication flow, form validation |
| `dashboard.cy.ts` | KPI cards, map rendering, trip summary |
| `fleet.cy.ts` | Vehicle list, filters, pagination, detail panel |
| `alerts.cy.ts` | Alert cards, severity filters, sort, bulk delete |
| `add-vehicle.cy.ts` | Add vehicle form, validation, duplicate detection |
| `navigation.cy.ts` | Route navigation, sidebar links, auth guard redirects |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 20.x | Core framework |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Leaflet | 1.9 | Interactive maps |
| Chart.js | 4.5 | Bar charts (alert severity) |
| RxJS | 7.8 | Reactive data streams |
| Karma + Jasmine | Latest | Unit testing |
| Cypress | 15.x | E2E testing |
| IndexedDB | Native | Client-side persistence |
| Web Workers | Native | Off-main-thread map processing |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd fleet-pulse
npm install
```

### Development Server

```bash
npm start
# or
ng serve --open
```

Navigate to `http://localhost:4200`. The app will auto-reload on file changes.

### Demo Credentials

| Field | Value |
|---|---|
| Username | `fleet.manager` |
| Password | `Fleet@123` |

All protected routes (Dashboard, Fleet, Alerts) require authentication. Unauthenticated users are redirected to the login page via `authGuard`.

### Build

```bash
npm run build
```

Build artifacts are stored in the `dist/` directory.

### 🌐 Live Demo (GitHub Pages)

The app is automatically deployed to GitHub Pages on every push to `main`:

**https://gowthambalashanmugam.github.io/fleet-insight-dashboard/**

To enable GitHub Pages for your fork:
1. Go to your repo → Settings → Pages
2. Under "Build and deployment", select Source: **GitHub Actions**
3. Push to `main` — the workflow at `.github/workflows/deploy.yml` handles the rest

The workflow builds the Angular app with the correct `--base-href`, copies `index.html` to `404.html` for SPA routing support, and deploys to GitHub Pages.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
