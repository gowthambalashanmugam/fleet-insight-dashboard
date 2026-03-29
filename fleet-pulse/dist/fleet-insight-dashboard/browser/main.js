import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  withComponentInputBinding,
  withInterceptors
} from "./chunk-PH2TNZM5.js";
import {
  ALERT_DATA_SERVICE,
  TRIP_DATA_SERVICE,
  VEHICLE_DATA_SERVICE
} from "./chunk-KGYIFEOV.js";
import {
  Component,
  Injectable,
  of,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-AAYVMCB3.js";

// src/app/layout/header/header.component.ts
var HeaderComponent = class _HeaderComponent {
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], decls: 6, vars: 0, consts: [[1, "flex", "h-16", "items-center", "justify-between", "border-b", "border-gray-200", "bg-white", "px-6"], [1, "text-lg", "font-semibold", "text-gray-800"], [1, "flex", "items-center", "gap-4"], [1, "text-sm", "text-gray-500"]], template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "header", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Fleet Insight Dashboard");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 2)(4, "span", 3);
      \u0275\u0275text(5, "Welcome");
      \u0275\u0275domElementEnd()()();
    }
  }, styles: ["\n\n/*# sourceMappingURL=header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderComponent, [{
    type: Component,
    args: [{ selector: "app-header", template: '<header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">\n  <h1 class="text-lg font-semibold text-gray-800">Fleet Insight Dashboard</h1>\n  <div class="flex items-center gap-4">\n    <span class="text-sm text-gray-500">Welcome</span>\n  </div>\n</header>\n', styles: ["/* src/app/layout/header/header.component.scss */\n/*# sourceMappingURL=header.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/layout/header/header.component.ts", lineNumber: 8 });
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
    loadComponent: () => import("./chunk-ATQNZNRD.js").then((m) => m.LoginComponent)
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
        loadComponent: () => import("./chunk-47LVBYBB.js").then((m) => m.DashboardComponent)
      },
      {
        path: "fleet",
        loadComponent: () => import("./chunk-WIPANINR.js").then((m) => m.FleetComponent)
      },
      {
        path: "settings",
        loadComponent: () => import("./chunk-4P5PEOKO.js").then((m) => m.SettingsComponent)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

// src/app/core/services/mock-vehicle-data.service.ts
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
var STATUSES = ["Active", "Idle", "Maintenance"];
function buildMockVehicles() {
  return SWEDISH_CITIES.map((city, i) => {
    const status = STATUSES[i % STATUSES.length];
    const id = `VH-${String(i + 1).padStart(3, "0")}`;
    return {
      id,
      name: `Truck ${city.name}`,
      registration: `ABC ${100 + i}`,
      status,
      latitude: city.lat + (Math.random() - 0.5) * 0.1,
      longitude: city.lng + (Math.random() - 0.5) * 0.1,
      speed: status === "Active" ? Math.round(40 + Math.random() * 80) : 0,
      fuelLevel: Math.round(10 + Math.random() * 90)
    };
  });
}
var MockVehicleDataService = class _MockVehicleDataService {
  vehicles = buildMockVehicles();
  getVehicles() {
    return of(this.vehicles);
  }
  static \u0275fac = function MockVehicleDataService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MockVehicleDataService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MockVehicleDataService, factory: _MockVehicleDataService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MockVehicleDataService, [{
    type: Injectable
  }], null, null);
})();

// src/app/core/services/mock-trip-data.service.ts
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
var STATUSES2 = ["Ongoing", "Done", "Cancelled"];
function buildMockTrips() {
  return Array.from({ length: 10 }, (_, i) => {
    const driver = DRIVERS[i % DRIVERS.length];
    const hours = Math.floor(1 + Math.random() * 5);
    const minutes = Math.floor(Math.random() * 60);
    return {
      id: `TR-${String(i + 1).padStart(3, "0")}`,
      tripNumber: `TRIP-${2024e3 + i + 1}`,
      driver,
      vehicle: {
        name: `Truck ${DESTINATIONS[i % DESTINATIONS.length]}`,
        registration: `ABC ${100 + i}`
      },
      destination: DESTINATIONS[(i + 3) % DESTINATIONS.length],
      duration: `${hours}h ${minutes}m`,
      status: STATUSES2[i % STATUSES2.length]
    };
  });
}
var MockTripDataService = class _MockTripDataService {
  trips = buildMockTrips();
  getTrips() {
    return of(this.trips);
  }
  static \u0275fac = function MockTripDataService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MockTripDataService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MockTripDataService, factory: _MockTripDataService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MockTripDataService, [{
    type: Injectable
  }], null, null);
})();

// src/app/core/services/mock-alert-data.service.ts
var SEVERITIES = ["low", "medium", "high"];
var ALERT_LOCATIONS = [
  { lat: 59.35, lng: 18.1, city: "Stockholm" },
  { lat: 57.7, lng: 11.95, city: "Gothenburg" },
  { lat: 55.62, lng: 13.02, city: "Malm\xF6" },
  { lat: 63.82, lng: 20.3, city: "Ume\xE5" },
  { lat: 65.6, lng: 22.13, city: "Lule\xE5" }
];
var MESSAGES = [
  "Engine temperature warning",
  "Low fuel alert",
  "Speeding detected",
  "Maintenance overdue",
  "Tire pressure low"
];
function buildMockAlerts() {
  return ALERT_LOCATIONS.map((loc, i) => ({
    id: `AL-${String(i + 1).padStart(3, "0")}`,
    vehicleId: `VH-${String(i + 1).padStart(3, "0")}`,
    latitude: loc.lat,
    longitude: loc.lng,
    severity: SEVERITIES[i % SEVERITIES.length],
    message: MESSAGES[i % MESSAGES.length]
  }));
}
var MockAlertDataService = class _MockAlertDataService {
  alerts = buildMockAlerts();
  getAlerts() {
    return of(this.alerts);
  }
  static \u0275fac = function MockAlertDataService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MockAlertDataService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MockAlertDataService, factory: _MockAlertDataService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MockAlertDataService, [{
    type: Injectable
  }], null, null);
})();

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([])),
    { provide: VEHICLE_DATA_SERVICE, useClass: MockVehicleDataService },
    { provide: TRIP_DATA_SERVICE, useClass: MockTripDataService },
    { provide: ALERT_DATA_SERVICE, useClass: MockAlertDataService }
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
