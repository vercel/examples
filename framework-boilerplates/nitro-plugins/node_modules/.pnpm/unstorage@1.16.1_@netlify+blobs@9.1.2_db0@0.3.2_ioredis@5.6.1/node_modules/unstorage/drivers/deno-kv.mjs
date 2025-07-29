import { defineDriver, createError, normalizeKey } from "./utils/index.mjs";
const DRIVER_NAME = "deno-kv";
export default defineDriver(
  (opts = {}) => {
    const basePrefix = opts.base ? normalizeKey(opts.base).split(":") : [];
    const r = (key = "") => [...basePrefix, ...key.split(":")].filter(Boolean);
    let _kv;
    const getKv = () => {
      if (_kv) {
        return _kv;
      }
      if (opts.openKv) {
        _kv = opts.openKv();
      } else {
        if (!globalThis.Deno) {
          throw createError(
            DRIVER_NAME,
            "Missing global `Deno`. Are you running in Deno? (hint: use `deno-kv-node` driver for Node.js)"
          );
        }
        if (!Deno.openKv) {
          throw createError(
            DRIVER_NAME,
            "Missing `Deno.openKv`. Are you running Deno with --unstable-kv?"
          );
        }
        _kv = Deno.openKv(opts.path);
      }
      return _kv;
    };
    return {
      name: DRIVER_NAME,
      getInstance() {
        return getKv();
      },
      async hasItem(key) {
        const kv = await getKv();
        const value = await kv.get(r(key));
        return !!value.value;
      },
      async getItem(key) {
        const kv = await getKv();
        const value = await kv.get(r(key));
        return value.value;
      },
      async getItemRaw(key) {
        const kv = await getKv();
        const value = await kv.get(r(key));
        return value.value;
      },
      async setItem(key, value) {
        const kv = await getKv();
        await kv.set(r(key), value);
      },
      async setItemRaw(key, value) {
        const kv = await getKv();
        await kv.set(r(key), value);
      },
      async removeItem(key) {
        const kv = await getKv();
        await kv.delete(r(key));
      },
      async getKeys(base) {
        const kv = await getKv();
        const keys = [];
        for await (const entry of kv.list({ prefix: r(base) })) {
          keys.push(
            (basePrefix.length > 0 ? entry.key.slice(basePrefix.length) : entry.key).join(":")
          );
        }
        return keys;
      },
      async clear(base) {
        const kv = await getKv();
        const batch = kv.atomic();
        for await (const entry of kv.list({ prefix: r(base) })) {
          batch.delete(entry.key);
        }
        await batch.commit();
      },
      async dispose() {
        if (_kv) {
          const kv = await _kv;
          await kv.close();
          _kv = void 0;
        }
      }
    };
  }
);
