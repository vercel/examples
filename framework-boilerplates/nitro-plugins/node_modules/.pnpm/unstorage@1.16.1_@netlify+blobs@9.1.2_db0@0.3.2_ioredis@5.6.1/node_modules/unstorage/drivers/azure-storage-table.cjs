"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _dataTables = require("@azure/data-tables");
var _identity = require("@azure/identity");
const DRIVER_NAME = "azure-storage-table";
module.exports = (0, _utils.defineDriver)(opts => {
  const {
    accountName = null,
    tableName = "unstorage",
    partitionKey = "unstorage",
    accountKey = null,
    sasKey = null,
    connectionString = null,
    pageSize = 1e3
  } = opts;
  let client;
  const getClient = () => {
    if (client) {
      return client;
    }
    if (!accountName) {
      throw (0, _utils.createRequiredError)(DRIVER_NAME, "accountName");
    }
    if (pageSize > 1e3) {
      throw (0, _utils.createError)(DRIVER_NAME, "`pageSize` exceeds the maximum allowed value of `1000`");
    }
    if (accountKey) {
      const credential = new _dataTables.AzureNamedKeyCredential(accountName, accountKey);
      client = new _dataTables.TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);
    } else if (sasKey) {
      const credential = new _dataTables.AzureSASCredential(sasKey);
      client = new _dataTables.TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);
    } else if (connectionString) {
      client = _dataTables.TableClient.fromConnectionString(connectionString, tableName);
    } else {
      const credential = new _identity.DefaultAzureCredential();
      client = new _dataTables.TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);
    }
    return client;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: getClient,
    async hasItem(key) {
      try {
        await getClient().getEntity(partitionKey, key);
        return true;
      } catch {
        return false;
      }
    },
    async getItem(key) {
      try {
        const entity = await getClient().getEntity(partitionKey, key);
        return entity.unstorageValue;
      } catch {
        return null;
      }
    },
    async setItem(key, value) {
      const entity = {
        partitionKey,
        rowKey: key,
        unstorageValue: value
      };
      await getClient().upsertEntity(entity, "Replace");
    },
    async removeItem(key) {
      await getClient().deleteEntity(partitionKey, key);
    },
    async getKeys() {
      const iterator = getClient().listEntities().byPage({
        maxPageSize: pageSize
      });
      const keys = [];
      for await (const page of iterator) {
        const pageKeys = page.map(entity => entity.rowKey).filter(Boolean);
        keys.push(...pageKeys);
      }
      return keys;
    },
    async getMeta(key) {
      const entity = await getClient().getEntity(partitionKey, key);
      return {
        mtime: entity.timestamp ? new Date(entity.timestamp) : void 0,
        etag: entity.etag
      };
    },
    async clear() {
      const iterator = getClient().listEntities().byPage({
        maxPageSize: pageSize
      });
      for await (const page of iterator) {
        await Promise.all(page.map(async entity => {
          if (entity.partitionKey && entity.rowKey) {
            await getClient().deleteEntity(entity.partitionKey, entity.rowKey);
          }
        }));
      }
    }
  };
});