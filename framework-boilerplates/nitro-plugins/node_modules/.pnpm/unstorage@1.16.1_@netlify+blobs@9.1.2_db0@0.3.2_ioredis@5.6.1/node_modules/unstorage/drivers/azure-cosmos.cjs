"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _cosmos = require("@azure/cosmos");
var _identity = require("@azure/identity");
const DRIVER_NAME = "azure-cosmos";
module.exports = (0, _utils.defineDriver)(opts => {
  let client;
  const getCosmosClient = async () => {
    if (client) {
      return client;
    }
    if (!opts.endpoint) {
      throw (0, _utils.createRequiredError)(DRIVER_NAME, "endpoint");
    }
    if (opts.accountKey) {
      const cosmosClient = new _cosmos.CosmosClient({
        endpoint: opts.endpoint,
        key: opts.accountKey
      });
      const {
        database
      } = await cosmosClient.databases.createIfNotExists({
        id: opts.databaseName || "unstorage"
      });
      const {
        container
      } = await database.containers.createIfNotExists({
        id: opts.containerName || "unstorage"
      });
      client = container;
    } else {
      const credential = new _identity.DefaultAzureCredential();
      const cosmosClient = new _cosmos.CosmosClient({
        endpoint: opts.endpoint,
        aadCredentials: credential
      });
      const {
        database
      } = await cosmosClient.databases.createIfNotExists({
        id: opts.databaseName || "unstorage"
      });
      const {
        container
      } = await database.containers.createIfNotExists({
        id: opts.containerName || "unstorage"
      });
      client = container;
    }
    return client;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: getCosmosClient,
    async hasItem(key) {
      const item = await (await getCosmosClient()).item(key).read();
      return item.resource ? true : false;
    },
    async getItem(key) {
      const item = await (await getCosmosClient()).item(key).read();
      return item.resource ? item.resource.value : null;
    },
    async setItem(key, value) {
      const modified = /* @__PURE__ */new Date();
      await (await getCosmosClient()).items.upsert({
        id: key,
        value,
        modified
      }, {
        consistencyLevel: "Session"
      });
    },
    async removeItem(key) {
      await (await getCosmosClient()).item(key).delete({
        consistencyLevel: "Session"
      });
    },
    async getKeys() {
      const iterator = (await getCosmosClient()).items.query(`SELECT { id } from c`);
      return (await iterator.fetchAll()).resources.map(item => item.id);
    },
    async getMeta(key) {
      const item = await (await getCosmosClient()).item(key).read();
      return {
        mtime: item.resource?.modified ? new Date(item.resource.modified) : void 0
      };
    },
    async clear() {
      const iterator = (await getCosmosClient()).items.query(`SELECT { id } from c`);
      const items = (await iterator.fetchAll()).resources;
      for (const item of items) {
        await (await getCosmosClient()).item(item.id).delete({
          consistencyLevel: "Session"
        });
      }
    }
  };
});