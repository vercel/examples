"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _blob = require("@vercel/blob");
var _utils = require("./utils/index.cjs");
const DRIVER_NAME = "vercel-blob";
module.exports = (0, _utils.defineDriver)(opts => {
  const optsBase = (0, _utils.normalizeKey)(opts?.base);
  const r = (...keys) => (0, _utils.joinKeys)(optsBase, ...keys).replace(/:/g, "/");
  const envName = `${opts.envPrefix || "BLOB"}_READ_WRITE_TOKEN`;
  const getToken = () => {
    if (opts.access !== "public") {
      throw (0, _utils.createError)(DRIVER_NAME, `You must set { access: "public" }`);
    }
    const token = opts.token || globalThis.process?.env?.[envName];
    if (!token) {
      throw (0, _utils.createError)(DRIVER_NAME, `Missing token. Set ${envName} env or token config.`);
    }
    return token;
  };
  const get = async key => {
    const {
      blobs
    } = await (0, _blob.list)({
      token: getToken(),
      prefix: r(key)
    });
    const blob = blobs.find(item => item.pathname === r(key));
    return blob;
  };
  return {
    name: DRIVER_NAME,
    async hasItem(key) {
      const blob = await get(key);
      return !!blob;
    },
    async getItem(key) {
      const blob = await get(key);
      return blob ? fetch(blob.url).then(res => res.text()) : null;
    },
    async getItemRaw(key) {
      const blob = await get(key);
      return blob ? fetch(blob.url).then(res => res.arrayBuffer()) : null;
    },
    async getMeta(key) {
      const blob = await get(key);
      if (!blob) return null;
      const blobHead = await (0, _blob.head)(blob.url, {
        token: getToken()
      });
      if (!blobHead) return null;
      return {
        mtime: blobHead.uploadedAt,
        ...blobHead
      };
    },
    async setItem(key, value, opts2) {
      await (0, _blob.put)(r(key), value, {
        access: "public",
        addRandomSuffix: false,
        token: getToken(),
        ...opts2
      });
    },
    async setItemRaw(key, value, opts2) {
      await (0, _blob.put)(r(key), value, {
        access: "public",
        addRandomSuffix: false,
        token: getToken(),
        ...opts2
      });
    },
    async removeItem(key) {
      const blob = await get(key);
      if (blob) await (0, _blob.del)(blob.url, {
        token: getToken()
      });
    },
    async getKeys(base) {
      const blobs = [];
      let cursor = void 0;
      do {
        const listBlobResult = await (0, _blob.list)({
          token: getToken(),
          cursor,
          prefix: r(base)
        });
        cursor = listBlobResult.cursor;
        for (const blob of listBlobResult.blobs) {
          blobs.push(blob);
        }
      } while (cursor);
      return blobs.map(blob => blob.pathname.replace(new RegExp(`^${optsBase.replace(/:/g, "/")}/`), ""));
    },
    async clear(base) {
      let cursor = void 0;
      const blobs = [];
      do {
        const listBlobResult = await (0, _blob.list)({
          token: getToken(),
          cursor,
          prefix: r(base)
        });
        blobs.push(...listBlobResult.blobs);
        cursor = listBlobResult.cursor;
      } while (cursor);
      if (blobs.length > 0) {
        await (0, _blob.del)(blobs.map(blob => blob.url), {
          token: getToken()
        });
      }
    }
  };
});