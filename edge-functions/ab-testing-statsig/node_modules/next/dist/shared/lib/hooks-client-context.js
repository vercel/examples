"use client";
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LayoutSegmentsContext = exports.ParamsContext = exports.PathnameContext = exports.SearchParamsContext = void 0;
var _react = require("react");

const SearchParamsContext = (0, _react).createContext(null);
exports.SearchParamsContext = SearchParamsContext;
const PathnameContext = (0, _react).createContext(null);
exports.PathnameContext = PathnameContext;
const ParamsContext = (0, _react).createContext(null);
exports.ParamsContext = ParamsContext;
const LayoutSegmentsContext = (0, _react).createContext(null);
exports.LayoutSegmentsContext = LayoutSegmentsContext;
if (process.env.NODE_ENV !== 'production') {
    SearchParamsContext.displayName = 'SearchParamsContext';
    PathnameContext.displayName = 'PathnameContext';
    ParamsContext.displayName = 'ParamsContext';
    LayoutSegmentsContext.displayName = 'LayoutSegmentsContext';
}

//# sourceMappingURL=hooks-client-context.js.map