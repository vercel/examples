import { createError, createRequiredError, defineDriver } from "./utils/index.mjs";
import {
  TableClient,
  AzureNamedKeyCredential,
  AzureSASCredential
} from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";
const DRIVER_NAME = "azure-storage-table";
export default defineDriver((opts) => {
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
      throw createRequiredError(DRIVER_NAME, "accountName");
    }
    if (pageSize > 1e3) {
      throw createError(
        DRIVER_NAME,
        "`pageSize` exceeds the maximum allowed value of `1000`"
      );
    }
    if (accountKey) {
      const credential = new AzureNamedKeyCredential(accountName, accountKey);
      client = new TableClient(
        `https://${accountName}.table.core.windows.net`,
        tableName,
        credential
      );
    } else if (sasKey) {
      const credential = new AzureSASCredential(sasKey);
      client = new TableClient(
        `https://${accountName}.table.core.windows.net`,
        tableName,
        credential
      );
    } else if (connectionString) {
      client = TableClient.fromConnectionString(connectionString, tableName);
    } else {
      const credential = new DefaultAzureCredential();
      client = new TableClient(
        `https://${accountName}.table.core.windows.net`,
        tableName,
        credential
      );
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
      const iterator = getClient().listEntities().byPage({ maxPageSize: pageSize });
      const keys = [];
      for await (const page of iterator) {
        const pageKeys = page.map((entity) => entity.rowKey).filter(Boolean);
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
      const iterator = getClient().listEntities().byPage({ maxPageSize: pageSize });
      for await (const page of iterator) {
        await Promise.all(
          page.map(async (entity) => {
            if (entity.partitionKey && entity.rowKey) {
              await getClient().deleteEntity(
                entity.partitionKey,
                entity.rowKey
              );
            }
          })
        );
      }
    }
  };
});
