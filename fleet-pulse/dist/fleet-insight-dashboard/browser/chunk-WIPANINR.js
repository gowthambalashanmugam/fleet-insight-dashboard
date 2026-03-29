import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-AAYVMCB3.js";

// src/app/features/fleet/fleet.component.ts
var FleetComponent = class _FleetComponent {
  static \u0275fac = function FleetComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FleetComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FleetComponent, selectors: [["app-fleet"]], decls: 5, vars: 0, consts: [[1, "text-2xl", "font-bold", "text-gray-800"], [1, "mt-1", "text-sm", "text-gray-500"]], template: function FleetComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div")(1, "h2", 0);
      \u0275\u0275text(2, "Fleet Management");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "p", 1);
      \u0275\u0275text(4, "Manage and monitor your vehicles");
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n\n/*# sourceMappingURL=fleet.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FleetComponent, [{
    type: Component,
    args: [{ selector: "app-fleet", template: '<div>\n  <h2 class="text-2xl font-bold text-gray-800">Fleet Management</h2>\n  <p class="mt-1 text-sm text-gray-500">Manage and monitor your vehicles</p>\n</div>\n', styles: ["/* src/app/features/fleet/fleet.component.scss */\n/*# sourceMappingURL=fleet.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FleetComponent, { className: "FleetComponent", filePath: "src/app/features/fleet/fleet.component.ts", lineNumber: 8 });
})();
export {
  FleetComponent
};
//# sourceMappingURL=chunk-WIPANINR.js.map
