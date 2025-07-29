import { createClient } from "@vercel/kv";
import { defineDriver, normalizeKey, joinKeys, createError } from "./utils/index.mjs";
const DRIVER_NAME = "vercel-kv";
export default defineDriver((opts) => {
  const base = normalizeKey(opts?.base);
  const r = (...keys) => joinKeys(base, ...keys);
  let _client;
  const getClient = () => {
    if (!_client) {
      const envPrefix = typeof process !== "undefined" && opts.env !== false ? `${opts.env || "KV"}_` : "";
      if (!opts.url) {
        const envName = envPrefix + "REST_API_URL";
        if (envPrefix && process.env[envName]) {
          opts.url = process.env[envName];
        } else {
          throw createError(
            "vercel-kv",
            `missing required \`url\` option or '${envName}' env.`
          );
        }
      }
      if (!opts.token) {
        const envName = envPrefix + "REST_API_TOKEN";
        if (envPrefix && process.env[envName]) {
          opts.token = process.env[envName];
        } else {
          throw createError(
            "vercel-kv",
            `missing required \`token\` option or '${envName}' env.`
          );
        }
      }
      _client = createClient(
        opts
      );
    }
    return _client;
  };
  const scan = async (pattern) => {
    const client = getClient();
    const keys = [];
    let cursor = "0";
    do {
      const [nextCursor, scanKeys] = await client.scan(cursor, {
        match: pattern,
        count: opts.scanCount
      });
      cursor = nextCursor;
      keys.push(...scanKeys);
    } while (cursor !== "0");
    return keys;
  };
  return {
    name: DRIVER_NAME,
    getInstance: getClient,
    hasItem(key) {
      return getClient().exists(r(key)).then(Boolean);
    },
    getItem(key) {
      return getClient().get(r(key));
    },
    setItem(key, value, tOptions) {
      const ttl = tOptions?.ttl ?? opts.ttl;
      return getClient().set(r(key), value, ttl ? { ex: ttl } : void 0).then(() => {
      });
    },
    removeItem(key) {
      return getClient().unlink(r(key)).then(() => {
      });
    },
    getKeys(base2) {
      return scan(r(base2, "*"));
    },
    async clear(base2) {
      const keys = await scan(r(base2, "*"));
      if (keys.length === 0) {
        return;
      }
      return getClient().del(...keys).then(() => {
      });
    }
  };
});
