"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
const OVERLAY_REMOVED = "__OVERLAY_REMOVED__";
const DRIVER_NAME = "overlay";
module.exports = (0, _utils.defineDriver)(options => {
  return {
    name: DRIVER_NAME,
    options,
    async hasItem(key, opts) {
      for (const layer of options.layers) {
        if (await layer.hasItem(key, opts)) {
          if (layer === options.layers[0] && (await options.layers[0]?.getItem(key)) === OVERLAY_REMOVED) {
            return false;
          }
          return true;
        }
      }
      return false;
    },
    async getItem(key) {
      for (const layer of options.layers) {
        const value = await layer.getItem(key);
        if (value === OVERLAY_REMOVED) {
          return null;
        }
        if (value !== null) {
          return value;
        }
      }
      return null;
    },
    // TODO: Support native meta
    // async getMeta (key) {},
    async setItem(key, value, opts) {
      await options.layers[0]?.setItem?.(key, value, opts);
    },
    async removeItem(key, opts) {
      await options.layers[0]?.setItem?.(key, OVERLAY_REMOVED, opts);
    },
    async getKeys(base, opts) {
      const allKeys = await Promise.all(options.layers.map(async layer => {
        const keys = await layer.getKeys(base, opts);
        return keys.map(key => (0, _utils.normalizeKey)(key));
      }));
      const uniqueKeys = [...new Set(allKeys.flat())];
      const existingKeys = await Promise.all(uniqueKeys.map(async key => {
        if ((await options.layers[0]?.getItem(key)) === OVERLAY_REMOVED) {
          return false;
        }
        return key;
      }));
      return existingKeys.filter(Boolean);
    },
    async dispose() {
      await Promise.all(options.layers.map(async layer => {
        if (layer.dispose) {
          await layer.dispose();
        }
      }));
    }
  };
});