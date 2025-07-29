"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _blobs = require("@netlify/blobs");
var _ofetch = require("ofetch");
const DRIVER_NAME = "netlify-blobs";
module.exports = (0, _utils.defineDriver)(options => {
  const {
    deployScoped,
    name,
    ...opts
  } = options;
  let store;
  const getClient = () => {
    if (!store) {
      if (deployScoped) {
        if (name) {
          throw (0, _utils.createError)(DRIVER_NAME, "deploy-scoped stores cannot have a name");
        }
        store = (0, _blobs.getDeployStore)({
          fetch: _ofetch.fetch,
          ...options
        });
      } else {
        if (!name) {
          throw (0, _utils.createRequiredError)(DRIVER_NAME, "name");
        }
        store = (0, _blobs.getStore)({
          name: encodeURIComponent(name),
          fetch: _ofetch.fetch,
          ...opts
        });
      }
    }
    return store;
  };
  return {
    name: DRIVER_NAME,
    options,
    getInstance: getClient,
    async hasItem(key) {
      return getClient().getMetadata(key).then(Boolean);
    },
    getItem: (key, tops) => {
      return getClient().get(key, tops);
    },
    getMeta(key) {
      return getClient().getMetadata(key);
    },
    getItemRaw(key, topts) {
      return getClient().get(key, {
        type: topts?.type ?? "arrayBuffer"
      });
    },
    async setItem(key, value, topts) {
      await getClient().set(key, value, topts);
    },
    async setItemRaw(key, value, topts) {
      await getClient().set(key, value, topts);
    },
    removeItem(key) {
      return getClient().delete(key);
    },
    async getKeys(base, tops) {
      return (await getClient().list({
        ...tops,
        prefix: base
      })).blobs.map(item => item.key);
    },
    async clear(base) {
      const client = getClient();
      return Promise.allSettled((await client.list({
        prefix: base
      })).blobs.map(item => client.delete(item.key))).then(() => {});
    }
  };
});