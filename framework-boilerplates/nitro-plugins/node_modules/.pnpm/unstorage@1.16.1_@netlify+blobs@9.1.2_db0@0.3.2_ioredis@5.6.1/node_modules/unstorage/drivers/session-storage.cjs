"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _localstorage = _interopRequireDefault(require("./localstorage.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DRIVER_NAME = "session-storage";
module.exports = (0, _utils.defineDriver)((opts = {}) => {
  return {
    ...(0, _localstorage.default)({
      windowKey: "sessionStorage",
      ...opts
    }),
    name: DRIVER_NAME
  };
});