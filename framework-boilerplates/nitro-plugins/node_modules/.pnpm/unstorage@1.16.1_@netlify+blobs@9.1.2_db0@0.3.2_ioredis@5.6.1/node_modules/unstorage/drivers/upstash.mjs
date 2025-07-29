import { Redis } from "@upstash/redis";
import { defineDriver, normalizeKey, joinKeys } from "./utils/index.mjs";
const DRIVER_NAME = "upstash";
export default defineDriver(
  (options = {}) => {
    const base = normalizeKey(options?.base);
    const r = (...keys) => joinKeys(base, ...keys);
    let redisClient;
    const getClient = () => {
      if (redisClient) {
        return redisClient;
      }
      const url = options.url || globalThis.process?.env?.UPSTASH_REDIS_REST_URL;
      const token = options.token || globalThis.process?.env?.UPSTASH_REDIS_REST_TOKEN;
      redisClient = new Redis({ url, token, ...options });
      return redisClient;
    };
    const scan = async (pattern) => {
      const client = getClient();
      const keys = [];
      let cursor = "0";
      do {
        const [nextCursor, scanKeys] = await client.scan(cursor, {
          match: pattern,
          count: options.scanCount
        });
        cursor = nextCursor;
        keys.push(...scanKeys);
      } while (cursor !== "0");
      return keys;
    };
    return {
      name: DRIVER_NAME,
      getInstance: getClient,
      async hasItem(key) {
        return Boolean(await getClient().exists(r(key)));
      },
      async getItem(key) {
        return await getClient().get(r(key));
      },
      async getItems(items) {
        const keys = items.map((item) => r(item.key));
        const data = await getClient().mget(...keys);
        return keys.map((key, index) => {
          return {
            key: base ? key.slice(base.length + 1) : key,
            value: data[index] ?? null
          };
        });
      },
      async setItem(key, value, tOptions) {
        const ttl = tOptions?.ttl || options.ttl;
        return getClient().set(r(key), value, ttl ? { ex: ttl } : void 0).then(() => {
        });
      },
      async removeItem(key) {
        await getClient().unlink(r(key));
      },
      async getKeys(_base) {
        return await scan(r(_base, "*")).then(
          (keys) => base ? keys.map((key) => key.slice(base.length + 1)) : keys
        );
      },
      async clear(base2) {
        const keys = await scan(r(base2, "*"));
        if (keys.length === 0) {
          return;
        }
        await getClient().del(...keys);
      }
    };
  }
);
