"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
const DRIVER_NAME = "null";
module.exports = (0, _utils.defineDriver)(() => {
  return {
    name: DRIVER_NAME,
    hasItem() {
      return false;
    },
    getItem() {
      return null;
    },
    getItemRaw() {
      return null;
    },
    getItems() {
      return [];
    },
    getMeta() {
      return null;
    },
    getKeys() {
      return [];
    },
    setItem() {},
    setItemRaw() {},
    setItems() {},
    removeItem() {},
    clear() {}
  };
});