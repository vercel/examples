/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/constants.ts":
/*!**************************!*\
  !*** ./lib/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"EXPERIMENT\": () => (/* binding */ EXPERIMENT),\n/* harmony export */   \"GROUP_PARAM_FALLBACK\": () => (/* binding */ GROUP_PARAM_FALLBACK),\n/* harmony export */   \"UID_COOKIE\": () => (/* binding */ UID_COOKIE)\n/* harmony export */ });\nconst UID_COOKIE = \"uid\";\n// This is the experiment that will be used to determine the bucket\nconst EXPERIMENT = \"statsig_example\";\n// Default Experiment Group Fallback\nconst GROUP_PARAM_FALLBACK = \"error_default_bucket\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvY29uc3RhbnRzLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFPLE1BQU1BLGFBQWEsTUFBSztBQUMvQixtRUFBbUU7QUFDNUQsTUFBTUMsYUFBYSxrQkFBaUI7QUFDM0Msb0NBQW9DO0FBQzdCLE1BQU1DLHVCQUF1Qix1QkFBc0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9saWIvY29uc3RhbnRzLnRzPzA3OGUiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFVJRF9DT09LSUUgPSAndWlkJ1xuLy8gVGhpcyBpcyB0aGUgZXhwZXJpbWVudCB0aGF0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGJ1Y2tldFxuZXhwb3J0IGNvbnN0IEVYUEVSSU1FTlQgPSAnc3RhdHNpZ19leGFtcGxlJ1xuLy8gRGVmYXVsdCBFeHBlcmltZW50IEdyb3VwIEZhbGxiYWNrXG5leHBvcnQgY29uc3QgR1JPVVBfUEFSQU1fRkFMTEJBQ0sgPSAnZXJyb3JfZGVmYXVsdF9idWNrZXQnXG4iXSwibmFtZXMiOlsiVUlEX0NPT0tJRSIsIkVYUEVSSU1FTlQiLCJHUk9VUF9QQVJBTV9GQUxMQkFDSyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/constants.ts\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var statsig_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! statsig-react */ \"statsig-react\");\n/* harmony import */ var statsig_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(statsig_react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\n/* harmony import */ var _vercel_examples_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vercel/examples-ui */ \"@vercel/examples-ui\");\n/* harmony import */ var _vercel_examples_ui_globals_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vercel/examples-ui/globals.css */ \"./node_modules/@vercel/examples-ui/dist/globals.css\");\n/* harmony import */ var _vercel_examples_ui_globals_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_vercel_examples_ui_globals_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/constants */ \"./lib/constants.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_cookie__WEBPACK_IMPORTED_MODULE_2__, _vercel_examples_ui__WEBPACK_IMPORTED_MODULE_3__]);\n([js_cookie__WEBPACK_IMPORTED_MODULE_2__, _vercel_examples_ui__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nfunction App({ Component , pageProps  }) {\n    // Middleware will automatically set a cookie for the user if they visit a page\n    const userID = js_cookie__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get(_lib_constants__WEBPACK_IMPORTED_MODULE_5__.UID_COOKIE);\n    const Layout = (0,_vercel_examples_ui__WEBPACK_IMPORTED_MODULE_3__.getLayout)(Component);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(statsig_react__WEBPACK_IMPORTED_MODULE_1__.StatsigProvider, {\n        sdkKey: \"client-nueaQ4CLrxT6b2QE0CKNDHaMyBnPJ2ao8qNmqSOsLL0cd ,.\",\n        waitForInitialization: false,\n        user: {\n            userID\n        },\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Layout, {\n            title: \"Experimentation with Statsig\",\n            description: \"How to do experimentation with Statsig\",\n            path: \"edge-functions/ab-testing-statsig\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/joe/Statsig/vercel-examples/edge-functions/ab-testing-statsig/pages/_app.tsx\",\n                lineNumber: 25,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/joe/Statsig/vercel-examples/edge-functions/ab-testing-statsig/pages/_app.tsx\",\n            lineNumber: 20,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/joe/Statsig/vercel-examples/edge-functions/ab-testing-statsig/pages/_app.tsx\",\n        lineNumber: 15,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDK0M7QUFDaEI7QUFFZ0I7QUFDUDtBQUNLO0FBRTdDLFNBQVNJLElBQUksRUFBRUMsVUFBUyxFQUFFQyxVQUFTLEVBQVksRUFBRTtJQUMvQywrRUFBK0U7SUFDL0UsTUFBTUMsU0FBU04scURBQVcsQ0FBQ0Usc0RBQVVBO0lBQ3JDLE1BQU1NLFNBQVNQLDhEQUFTQSxDQUFjRztJQUV0QyxxQkFDRSw4REFBQ0wsMERBQWVBO1FBQ2RVLFFBQVFDLHlEQUEwQztRQUNsREcsdUJBQXVCLEtBQUs7UUFDNUJDLE1BQU07WUFBRVI7UUFBTztrQkFFZiw0RUFBQ0U7WUFDQ08sT0FBTTtZQUNOQyxhQUFZO1lBQ1pDLE1BQUs7c0JBRUwsNEVBQUNiO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEM7QUFFQSxpRUFBZUYsR0FBR0EsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xuaW1wb3J0IHsgU3RhdHNpZ1Byb3ZpZGVyIH0gZnJvbSAnc3RhdHNpZy1yZWFjdCdcbmltcG9ydCBDb29raWVzIGZyb20gJ2pzLWNvb2tpZSdcbmltcG9ydCB0eXBlIHsgTGF5b3V0UHJvcHMgfSBmcm9tICdAdmVyY2VsL2V4YW1wbGVzLXVpL2xheW91dCdcbmltcG9ydCB7IGdldExheW91dCB9IGZyb20gJ0B2ZXJjZWwvZXhhbXBsZXMtdWknXG5pbXBvcnQgJ0B2ZXJjZWwvZXhhbXBsZXMtdWkvZ2xvYmFscy5jc3MnXG5pbXBvcnQgeyBVSURfQ09PS0lFIH0gZnJvbSAnLi4vbGliL2NvbnN0YW50cydcblxuZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgLy8gTWlkZGxld2FyZSB3aWxsIGF1dG9tYXRpY2FsbHkgc2V0IGEgY29va2llIGZvciB0aGUgdXNlciBpZiB0aGV5IHZpc2l0IGEgcGFnZVxuICBjb25zdCB1c2VySUQgPSBDb29raWVzLmdldChVSURfQ09PS0lFKVxuICBjb25zdCBMYXlvdXQgPSBnZXRMYXlvdXQ8TGF5b3V0UHJvcHM+KENvbXBvbmVudClcblxuICByZXR1cm4gKFxuICAgIDxTdGF0c2lnUHJvdmlkZXJcbiAgICAgIHNka0tleT17cHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1RBVFNJR19DTElFTlRfS0VZIX1cbiAgICAgIHdhaXRGb3JJbml0aWFsaXphdGlvbj17ZmFsc2V9XG4gICAgICB1c2VyPXt7IHVzZXJJRCB9fVxuICAgID5cbiAgICAgIDxMYXlvdXRcbiAgICAgICAgdGl0bGU9XCJFeHBlcmltZW50YXRpb24gd2l0aCBTdGF0c2lnXCJcbiAgICAgICAgZGVzY3JpcHRpb249XCJIb3cgdG8gZG8gZXhwZXJpbWVudGF0aW9uIHdpdGggU3RhdHNpZ1wiXG4gICAgICAgIHBhdGg9XCJlZGdlLWZ1bmN0aW9ucy9hYi10ZXN0aW5nLXN0YXRzaWdcIlxuICAgICAgPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L0xheW91dD5cbiAgICA8L1N0YXRzaWdQcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBcbiJdLCJuYW1lcyI6WyJTdGF0c2lnUHJvdmlkZXIiLCJDb29raWVzIiwiZ2V0TGF5b3V0IiwiVUlEX0NPT0tJRSIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInVzZXJJRCIsImdldCIsIkxheW91dCIsInNka0tleSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVEFUU0lHX0NMSUVOVF9LRVkiLCJ3YWl0Rm9ySW5pdGlhbGl6YXRpb24iLCJ1c2VyIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsInBhdGgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./node_modules/@vercel/examples-ui/dist/globals.css":
/*!***********************************************************!*\
  !*** ./node_modules/@vercel/examples-ui/dist/globals.css ***!
  \***********************************************************/
/***/ (() => {



/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "statsig-react":
/*!********************************!*\
  !*** external "statsig-react" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("statsig-react");

/***/ }),

/***/ "@vercel/examples-ui":
/*!**************************************!*\
  !*** external "@vercel/examples-ui" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@vercel/examples-ui");;

/***/ }),

/***/ "js-cookie":
/*!****************************!*\
  !*** external "js-cookie" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = import("js-cookie");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();