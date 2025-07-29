"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _cloudflare = require("./utils/cloudflare.cjs");
const DRIVER_NAME = "cloudflare-r2-binding";
module.exports = (0, _utils.defineDriver)((opts = {}) => {
  const r = (key = "") => opts.base ? (0, _utils.joinKeys)(opts.base, key) : key;
  const getKeys = async base => {
    const binding = (0, _cloudflare.getR2Binding)(opts.binding);
    const kvList = await binding.list(base || opts.base ? {
      prefix: r(base)
    } : void 0);
    return kvList.objects.map(obj => obj.key);
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: () => (0, _cloudflare.getR2Binding)(opts.binding),
    async hasItem(key) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      return (await binding.head(key)) !== null;
    },
    async getMeta(key) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      const obj = await binding.head(key);
      if (!obj) return null;
      return {
        mtime: obj.uploaded,
        atime: obj.uploaded,
        ...obj
      };
    },
    getItem(key, topts) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      return binding.get(key, topts).then(r2 => r2?.text() ?? null);
    },
    async getItemRaw(key, topts) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      const object = await binding.get(key, topts);
      return object ? getObjBody(object, topts?.type) : null;
    },
    async setItem(key, value, topts) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      await binding.put(key, value, topts);
    },
    async setItemRaw(key, value, topts) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      await binding.put(key, value, topts);
    },
    async removeItem(key) {
      key = r(key);
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      await binding.delete(key);
    },
    getKeys(base) {
      return getKeys(base).then(keys => opts.base ? keys.map(key => key.slice(opts.base.length)) : keys);
    },
    async clear(base) {
      const binding = (0, _cloudflare.getR2Binding)(opts.binding);
      const keys = await getKeys(base);
      await binding.delete(keys);
    }
  };
});
function getObjBody(object, type) {
  switch (type) {
    case "object":
      {
        return object;
      }
    case "stream":
      {
        return object.body;
      }
    case "blob":
      {
        return object.blob();
      }
    case "arrayBuffer":
      {
        return object.arrayBuffer();
      }
    case "bytes":
      {
        return object.arrayBuffer().then(buffer => new Uint8Array(buffer));
      }
    // TODO: Default to bytes in v2
    default:
      {
        return object.arrayBuffer();
      }
  }
}