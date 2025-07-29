import { createRequiredError, defineDriver } from "./utils/index.mjs";
import { MongoClient } from "mongodb";
const DRIVER_NAME = "mongodb";
export default defineDriver((opts) => {
  let collection;
  const getMongoCollection = () => {
    if (!collection) {
      if (!opts.connectionString) {
        throw createRequiredError(DRIVER_NAME, "connectionString");
      }
      const mongoClient = new MongoClient(
        opts.connectionString,
        opts.clientOptions
      );
      const db = mongoClient.db(opts.databaseName || "unstorage");
      collection = db.collection(opts.collectionName || "unstorage");
    }
    return collection;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: getMongoCollection,
    async hasItem(key) {
      const result = await getMongoCollection().findOne({ key });
      return !!result;
    },
    async getItem(key) {
      const document = await getMongoCollection().findOne({ key });
      return document?.value ?? null;
    },
    async getItems(items) {
      const keys = items.map((item) => item.key);
      const result = await getMongoCollection().find({ key: { $in: keys } }).toArray();
      const resultMap = new Map(result.map((doc) => [doc.key, doc]));
      return keys.map((key) => {
        return { key, value: resultMap.get(key)?.value ?? null };
      });
    },
    async setItem(key, value) {
      const currentDateTime = /* @__PURE__ */ new Date();
      await getMongoCollection().updateOne(
        { key },
        {
          $set: { key, value, modifiedAt: currentDateTime },
          $setOnInsert: { createdAt: currentDateTime }
        },
        { upsert: true }
      );
    },
    async setItems(items) {
      const currentDateTime = /* @__PURE__ */ new Date();
      const operations = items.map(({ key, value }) => ({
        updateOne: {
          filter: { key },
          update: {
            $set: { key, value, modifiedAt: currentDateTime },
            $setOnInsert: { createdAt: currentDateTime }
          },
          upsert: true
        }
      }));
      await getMongoCollection().bulkWrite(operations);
    },
    async removeItem(key) {
      await getMongoCollection().deleteOne({ key });
    },
    async getKeys() {
      return await getMongoCollection().find().project({ key: true }).map((d) => d.key).toArray();
    },
    async getMeta(key) {
      const document = await getMongoCollection().findOne({ key });
      return document ? {
        mtime: document.modifiedAt,
        birthtime: document.createdAt
      } : {};
    },
    async clear() {
      await getMongoCollection().deleteMany({});
    }
  };
});
