import { defineDriver, normalizeKey } from "./utils/index.mjs";
import { UTApi } from "uploadthing/server";
const DRIVER_NAME = "uploadthing";
export default defineDriver((opts = {}) => {
  let client;
  const base = opts.base ? normalizeKey(opts.base) : "";
  const r = (key) => base ? `${base}:${key}` : key;
  const getClient = () => {
    return client ??= new UTApi({
      ...opts,
      defaultKeyType: "customId"
    });
  };
  const getKeys = async (base2) => {
    const client2 = getClient();
    const { files } = await client2.listFiles({});
    return files.map((file) => file.customId).filter((k) => k && k.startsWith(base2));
  };
  const toFile = (key, value) => {
    return Object.assign(new Blob([value]), {
      name: key,
      customId: key
    });
  };
  return {
    name: DRIVER_NAME,
    getInstance() {
      return getClient();
    },
    getKeys(base2) {
      return getKeys(r(base2));
    },
    async hasItem(key) {
      const client2 = getClient();
      const res = await client2.getFileUrls(r(key));
      return res.data.length > 0;
    },
    async getItem(key) {
      const client2 = getClient();
      const url = await client2.getFileUrls(r(key)).then((res) => res.data[0]?.url);
      if (!url) return null;
      return fetch(url).then((res) => res.text());
    },
    async getItemRaw(key) {
      const client2 = getClient();
      const url = await client2.getFileUrls(r(key)).then((res) => res.data[0]?.url);
      if (!url) return null;
      return fetch(url).then((res) => res.arrayBuffer());
    },
    async setItem(key, value) {
      const client2 = getClient();
      await client2.uploadFiles(toFile(r(key), value));
    },
    async setItemRaw(key, value) {
      const client2 = getClient();
      await client2.uploadFiles(toFile(r(key), value));
    },
    async setItems(items) {
      const client2 = getClient();
      await client2.uploadFiles(
        items.map((item) => toFile(r(item.key), item.value))
      );
    },
    async removeItem(key) {
      const client2 = getClient();
      await client2.deleteFiles([r(key)]);
    },
    async clear(base2) {
      const client2 = getClient();
      const keys = await getKeys(r(base2));
      await client2.deleteFiles(keys);
    }
    // getMeta(key, opts) {
    //   // TODO: We don't currently have an endpoint to fetch metadata, but it does exist
    // },
  };
});
