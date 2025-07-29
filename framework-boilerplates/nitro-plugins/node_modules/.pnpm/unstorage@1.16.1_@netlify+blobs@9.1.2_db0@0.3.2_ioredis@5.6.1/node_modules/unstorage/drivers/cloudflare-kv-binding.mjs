import { defineDriver, joinKeys } from "./utils/index.mjs";
import { getKVBinding } from "./utils/cloudflare.mjs";
const DRIVER_NAME = "cloudflare-kv-binding";
export default defineDriver((opts) => {
  const r = (key = "") => opts.base ? joinKeys(opts.base, key) : key;
  async function getKeys(base = "") {
    base = r(base);
    const binding = getKVBinding(opts.binding);
    const keys = [];
    let cursor = void 0;
    do {
      const kvList = await binding.list({ prefix: base || void 0, cursor });
      keys.push(...kvList.keys);
      cursor = kvList.list_complete ? void 0 : kvList.cursor;
    } while (cursor);
    return keys.map((key) => key.name);
  }
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: () => getKVBinding(opts.binding),
    async hasItem(key) {
      key = r(key);
      const binding = getKVBinding(opts.binding);
      return await binding.get(key) !== null;
    },
    getItem(key) {
      key = r(key);
      const binding = getKVBinding(opts.binding);
      return binding.get(key);
    },
    setItem(key, value, topts) {
      key = r(key);
      const binding = getKVBinding(opts.binding);
      return binding.put(
        key,
        value,
        topts ? {
          expirationTtl: topts?.ttl ? Math.max(topts.ttl, opts.minTTL ?? 60) : void 0,
          ...topts
        } : void 0
      );
    },
    removeItem(key) {
      key = r(key);
      const binding = getKVBinding(opts.binding);
      return binding.delete(key);
    },
    getKeys(base) {
      return getKeys(base).then(
        (keys) => keys.map((key) => opts.base ? key.slice(opts.base.length) : key)
      );
    },
    async clear(base) {
      const binding = getKVBinding(opts.binding);
      const keys = await getKeys(base);
      await Promise.all(keys.map((key) => binding.delete(key)));
    }
  };
});
