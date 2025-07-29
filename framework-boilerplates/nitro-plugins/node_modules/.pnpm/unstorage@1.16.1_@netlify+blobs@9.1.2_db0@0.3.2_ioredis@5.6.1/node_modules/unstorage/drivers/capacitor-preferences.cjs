"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preferences = require("@capacitor/preferences");
var _utils = require("./utils/index.cjs");
const DRIVER_NAME = "capacitor-preferences";
module.exports = (0, _utils.defineDriver)(opts => {
  const base = (0, _utils.normalizeKey)(opts?.base || "");
  const resolveKey = key => (0, _utils.joinKeys)(base, key);
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: () => _preferences.Preferences,
    hasItem(key) {
      return _preferences.Preferences.keys().then(r => r.keys.includes(resolveKey(key)));
    },
    getItem(key) {
      return _preferences.Preferences.get({
        key: resolveKey(key)
      }).then(r => r.value);
    },
    getItemRaw(key) {
      return _preferences.Preferences.get({
        key: resolveKey(key)
      }).then(r => r.value);
    },
    setItem(key, value) {
      return _preferences.Preferences.set({
        key: resolveKey(key),
        value
      });
    },
    setItemRaw(key, value) {
      return _preferences.Preferences.set({
        key: resolveKey(key),
        value
      });
    },
    removeItem(key) {
      return _preferences.Preferences.remove({
        key: resolveKey(key)
      });
    },
    async getKeys() {
      const {
        keys
      } = await _preferences.Preferences.keys();
      return keys.map(key => key.slice(base.length));
    },
    async clear(prefix) {
      const {
        keys
      } = await _preferences.Preferences.keys();
      const _prefix = resolveKey(prefix || "");
      await Promise.all(keys.filter(key => key.startsWith(_prefix)).map(key => _preferences.Preferences.remove({
        key
      })));
    }
  };
});