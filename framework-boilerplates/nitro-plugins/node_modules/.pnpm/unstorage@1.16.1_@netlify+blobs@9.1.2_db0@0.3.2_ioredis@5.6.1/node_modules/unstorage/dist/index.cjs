'use strict';

const destr = require('destr');
const utils = require('./shared/unstorage.DgtRghtF.cjs');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const destr__default = /*#__PURE__*/_interopDefaultCompat(destr);

function defineDriver(factory) {
  return factory;
}

const DRIVER_NAME = "memory";
const memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = utils.normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = utils.normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return utils.asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return utils.asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr__default(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return utils.asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: utils.joinKeys(batch.base, item.key),
              value: destr__default(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return utils.asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr__default(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return utils.asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return utils.asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => utils.deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await utils.asyncCall(driver.setItem, relativeKey, utils.stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return utils.asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: utils.stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return utils.asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              utils.stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await utils.asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await utils.asyncCall(driver.setItem, relativeKey, utils.serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await utils.asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await utils.asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = utils.normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await utils.asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await utils.asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr__default(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = utils.normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await utils.asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + utils.normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || utils.filterKeyByDepth(key, opts.maxDepth)) && utils.filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = utils.normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return utils.asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = utils.normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = utils.normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = utils.normalizeKey(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = utils.normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
async function snapshot(storage, base) {
  base = utils.normalizeBaseKey(base);
  const keys = await storage.getKeys(base);
  const snapshot2 = {};
  await Promise.all(
    keys.map(async (key) => {
      snapshot2[key.slice(base.length)] = await storage.getItem(key);
    })
  );
  return snapshot2;
}
async function restoreSnapshot(driver, snapshot2, base = "") {
  base = utils.normalizeBaseKey(base);
  await Promise.all(
    Object.entries(snapshot2).map((e) => driver.setItem(base + e[0], e[1]))
  );
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await utils.asyncCall(driver.dispose);
  }
}

const builtinDrivers = {
  "azure-app-configuration": "unstorage/drivers/azure-app-configuration",
  "azureAppConfiguration": "unstorage/drivers/azure-app-configuration",
  "azure-cosmos": "unstorage/drivers/azure-cosmos",
  "azureCosmos": "unstorage/drivers/azure-cosmos",
  "azure-key-vault": "unstorage/drivers/azure-key-vault",
  "azureKeyVault": "unstorage/drivers/azure-key-vault",
  "azure-storage-blob": "unstorage/drivers/azure-storage-blob",
  "azureStorageBlob": "unstorage/drivers/azure-storage-blob",
  "azure-storage-table": "unstorage/drivers/azure-storage-table",
  "azureStorageTable": "unstorage/drivers/azure-storage-table",
  "capacitor-preferences": "unstorage/drivers/capacitor-preferences",
  "capacitorPreferences": "unstorage/drivers/capacitor-preferences",
  "cloudflare-kv-binding": "unstorage/drivers/cloudflare-kv-binding",
  "cloudflareKVBinding": "unstorage/drivers/cloudflare-kv-binding",
  "cloudflare-kv-http": "unstorage/drivers/cloudflare-kv-http",
  "cloudflareKVHttp": "unstorage/drivers/cloudflare-kv-http",
  "cloudflare-r2-binding": "unstorage/drivers/cloudflare-r2-binding",
  "cloudflareR2Binding": "unstorage/drivers/cloudflare-r2-binding",
  "db0": "unstorage/drivers/db0",
  "deno-kv-node": "unstorage/drivers/deno-kv-node",
  "denoKVNode": "unstorage/drivers/deno-kv-node",
  "deno-kv": "unstorage/drivers/deno-kv",
  "denoKV": "unstorage/drivers/deno-kv",
  "fs-lite": "unstorage/drivers/fs-lite",
  "fsLite": "unstorage/drivers/fs-lite",
  "fs": "unstorage/drivers/fs",
  "github": "unstorage/drivers/github",
  "http": "unstorage/drivers/http",
  "indexedb": "unstorage/drivers/indexedb",
  "localstorage": "unstorage/drivers/localstorage",
  "lru-cache": "unstorage/drivers/lru-cache",
  "lruCache": "unstorage/drivers/lru-cache",
  "memory": "unstorage/drivers/memory",
  "mongodb": "unstorage/drivers/mongodb",
  "netlify-blobs": "unstorage/drivers/netlify-blobs",
  "netlifyBlobs": "unstorage/drivers/netlify-blobs",
  "null": "unstorage/drivers/null",
  "overlay": "unstorage/drivers/overlay",
  "planetscale": "unstorage/drivers/planetscale",
  "redis": "unstorage/drivers/redis",
  "s3": "unstorage/drivers/s3",
  "session-storage": "unstorage/drivers/session-storage",
  "sessionStorage": "unstorage/drivers/session-storage",
  "uploadthing": "unstorage/drivers/uploadthing",
  "upstash": "unstorage/drivers/upstash",
  "vercel-blob": "unstorage/drivers/vercel-blob",
  "vercelBlob": "unstorage/drivers/vercel-blob",
  "vercel-kv": "unstorage/drivers/vercel-kv",
  "vercelKV": "unstorage/drivers/vercel-kv"
};

exports.filterKeyByBase = utils.filterKeyByBase;
exports.filterKeyByDepth = utils.filterKeyByDepth;
exports.joinKeys = utils.joinKeys;
exports.normalizeBaseKey = utils.normalizeBaseKey;
exports.normalizeKey = utils.normalizeKey;
exports.prefixStorage = utils.prefixStorage;
exports.builtinDrivers = builtinDrivers;
exports.createStorage = createStorage;
exports.defineDriver = defineDriver;
exports.restoreSnapshot = restoreSnapshot;
exports.snapshot = snapshot;
