import { defineDriver, joinKeys } from "./utils/index.mjs";
import Redis from "ioredis";
const DRIVER_NAME = "redis";
export default defineDriver((opts) => {
  let redisClient;
  const getRedisClient = () => {
    if (redisClient) {
      return redisClient;
    }
    if (opts.cluster) {
      redisClient = new Redis.Cluster(opts.cluster, opts.clusterOptions);
    } else if (opts.url) {
      redisClient = new Redis(opts.url, opts);
    } else {
      redisClient = new Redis(opts);
    }
    return redisClient;
  };
  const base = (opts.base || "").replace(/:$/, "");
  const p = (...keys) => joinKeys(base, ...keys);
  const d = (key) => base ? key.replace(`${base}:`, "") : key;
  if (opts.preConnect) {
    try {
      getRedisClient();
    } catch (error) {
      console.error(error);
    }
  }
  const scan = async (pattern) => {
    const client = getRedisClient();
    const keys = [];
    let cursor = "0";
    do {
      const [nextCursor, scanKeys] = opts.scanCount ? await client.scan(cursor, "MATCH", pattern, "COUNT", opts.scanCount) : await client.scan(cursor, "MATCH", pattern);
      cursor = nextCursor;
      keys.push(...scanKeys);
    } while (cursor !== "0");
    return keys;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: getRedisClient,
    async hasItem(key) {
      return Boolean(await getRedisClient().exists(p(key)));
    },
    async getItem(key) {
      const value = await getRedisClient().get(p(key));
      return value ?? null;
    },
    async getItems(items) {
      const keys = items.map((item) => p(item.key));
      const data = await getRedisClient().mget(...keys);
      return keys.map((key, index) => {
        return {
          key: d(key),
          value: data[index] ?? null
        };
      });
    },
    async setItem(key, value, tOptions) {
      const ttl = tOptions?.ttl ?? opts.ttl;
      if (ttl) {
        await getRedisClient().set(p(key), value, "EX", ttl);
      } else {
        await getRedisClient().set(p(key), value);
      }
    },
    async removeItem(key) {
      await getRedisClient().unlink(p(key));
    },
    async getKeys(base2) {
      const keys = await scan(p(base2, "*"));
      return keys.map((key) => d(key));
    },
    async clear(base2) {
      const keys = await scan(p(base2, "*"));
      if (keys.length === 0) {
        return;
      }
      await getRedisClient().unlink(keys);
    },
    dispose() {
      return getRedisClient().disconnect();
    }
  };
});
