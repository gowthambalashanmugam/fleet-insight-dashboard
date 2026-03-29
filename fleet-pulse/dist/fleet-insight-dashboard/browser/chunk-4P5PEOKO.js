import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-AAYVMCB3.js";

// src/app/features/settings/settings.component.ts
var SettingsComponent = class _SettingsComponent {
  static \u0275fac = function SettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsComponent, selectors: [["app-settings"]], decls: 5, vars: 0, consts: [[1, "text-2xl", "font-bold", "text-gray-800"], [1, "mt-1", "text-sm", "text-gray-500"]], template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div")(1, "h2", 0);
      \u0275\u0275text(2, "Settings");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "p", 1);
      \u0275\u0275text(4, "Application configuration");
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n\n/*# sourceMappingURL=settings.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsComponent, [{
    type: Component,
    args: [{ selector: "app-settings", template: '<div>\n  <h2 class="text-2xl font-bold text-gray-800">Settings</h2>\n  <p class="mt-1 text-sm text-gray-500">Application configuration</p>\n</div>\n', styles: ["/* src/app/features/settings/settings.component.scss */\n/*# sourceMappingURL=settings.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/features/settings/settings.component.ts", lineNumber: 8 });
})();
export {
  SettingsComponent
};
//# sourceMappingURL=chunk-4P5PEOKO.js.map
