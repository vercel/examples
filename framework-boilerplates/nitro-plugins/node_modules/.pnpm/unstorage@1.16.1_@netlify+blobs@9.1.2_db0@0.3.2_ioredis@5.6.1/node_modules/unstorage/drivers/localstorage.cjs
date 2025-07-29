"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
const DRIVER_NAME = "localstorage";
module.exports = (0, _utils.defineDriver)((opts = {}) => {
  const storage = opts.storage || opts.localStorage || opts.sessionStorage || (opts.window || globalThis.window)?.[opts.windowKey || "localStorage"];
  if (!storage) {
    throw (0, _utils.createRequiredError)(DRIVER_NAME, "localStorage");
  }
  const base = opts.base ? (0, _utils.normalizeKey)(opts.base) : "";
  const r = key => (base ? `${base}:` : "") + key;
  let _storageListener;
  const _unwatch = () => {
    if (_storageListener) {
      opts.window?.removeEventListener("storage", _storageListener);
    }
    _storageListener = void 0;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: () => storage,
    hasItem(key) {
      return Object.prototype.hasOwnProperty.call(storage, r(key));
    },
    getItem(key) {
      return storage.getItem(r(key));
    },
    setItem(key, value) {
      return storage.setItem(r(key), value);
    },
    removeItem(key) {
      return storage.removeItem(r(key));
    },
    getKeys() {
      const allKeys = Object.keys(storage);
      return base ? allKeys.filter(key => key.startsWith(`${base}:`)).map(key => key.slice(base.length + 1)) : allKeys;
    },
    clear(prefix) {
      const _base = [base, prefix].filter(Boolean).join(":");
      if (_base) {
        for (const key of Object.keys(storage)) {
          if (key.startsWith(`${_base}:`)) {
            storage?.removeItem(key);
          }
        }
      } else {
        storage.clear();
      }
    },
    dispose() {
      if (opts.window && _storageListener) {
        opts.window.removeEventListener("storage", _storageListener);
      }
    },
    watch(callback) {
      if (!opts.window) {
        return _unwatch;
      }
      _storageListener = ev => {
        if (ev.key) {
          callback(ev.newValue ? "update" : "remove", ev.key);
        }
      };
      opts.window.addEventListener("storage", _storageListener);
      return _unwatch;
    }
  };
});