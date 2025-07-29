"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kv = require("@deno/kv");
var _index = require("./utils/index.cjs");
var _denoKv = _interopRequireDefault(require("./deno-kv.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DRIVER_NAME = "deno-kv-node";
module.exports = (0, _index.defineDriver)((opts = {}) => {
  const baseDriver = (0, _denoKv.default)({
    ...opts,
    openKv: () => (0, _kv.openKv)(opts.path, opts.openKvOptions)
  });
  return {
    ...baseDriver,
    getInstance() {
      return baseDriver.getInstance();
    },
    name: DRIVER_NAME
  };
});