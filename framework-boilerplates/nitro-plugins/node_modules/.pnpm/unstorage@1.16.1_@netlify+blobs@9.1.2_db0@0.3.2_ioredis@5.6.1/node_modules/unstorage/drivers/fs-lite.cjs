"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFs = require("node:fs");
var _nodePath = require("node:path");
var _utils = require("./utils/index.cjs");
var _nodeFs2 = require("./utils/node-fs.cjs");
const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
module.exports = (0, _utils.defineDriver)((opts = {}) => {
  if (!opts.base) {
    throw (0, _utils.createRequiredError)(DRIVER_NAME, "base");
  }
  opts.base = (0, _nodePath.resolve)(opts.base);
  const r = key => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw (0, _utils.createError)(DRIVER_NAME, `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`);
    }
    const resolved = (0, _nodePath.join)(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return (0, _nodeFs.existsSync)(r(key));
    },
    getItem(key) {
      return (0, _nodeFs2.readFile)(r(key), "utf8");
    },
    getItemRaw(key) {
      return (0, _nodeFs2.readFile)(r(key));
    },
    async getMeta(key) {
      const {
        atime,
        mtime,
        size,
        birthtime,
        ctime
      } = await _nodeFs.promises.stat(r(key)).catch(() => ({}));
      return {
        atime,
        mtime,
        size,
        birthtime,
        ctime
      };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return (0, _nodeFs2.writeFile)(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return (0, _nodeFs2.writeFile)(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return (0, _nodeFs2.unlink)(r(key));
    },
    getKeys(_base, topts) {
      return (0, _nodeFs2.readdirRecursive)(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await (0, _nodeFs2.rmRecursive)(r("."));
    }
  };
});