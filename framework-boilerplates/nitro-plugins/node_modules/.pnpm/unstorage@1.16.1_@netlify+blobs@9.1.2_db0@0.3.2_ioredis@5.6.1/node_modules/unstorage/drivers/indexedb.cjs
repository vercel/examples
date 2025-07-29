"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _idbKeyval = require("idb-keyval");
const DRIVER_NAME = "idb-keyval";
module.exports = (0, _utils.defineDriver)((opts = {}) => {
  const base = opts.base && opts.base.length > 0 ? `${opts.base}:` : "";
  const makeKey = key => base + key;
  let customStore;
  if (opts.dbName && opts.storeName) {
    customStore = (0, _idbKeyval.createStore)(opts.dbName, opts.storeName);
  }
  return {
    name: DRIVER_NAME,
    options: opts,
    async hasItem(key) {
      const item = await (0, _idbKeyval.get)(makeKey(key), customStore);
      return item === void 0 ? false : true;
    },
    async getItem(key) {
      const item = await (0, _idbKeyval.get)(makeKey(key), customStore);
      return item ?? null;
    },
    async getItemRaw(key) {
      const item = await (0, _idbKeyval.get)(makeKey(key), customStore);
      return item ?? null;
    },
    setItem(key, value) {
      return (0, _idbKeyval.set)(makeKey(key), value, customStore);
    },
    setItemRaw(key, value) {
      return (0, _idbKeyval.set)(makeKey(key), value, customStore);
    },
    removeItem(key) {
      return (0, _idbKeyval.del)(makeKey(key), customStore);
    },
    getKeys() {
      return (0, _idbKeyval.keys)(customStore);
    },
    clear() {
      return (0, _idbKeyval.clear)(customStore);
    }
  };
});