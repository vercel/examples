"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _keyvaultSecrets = require("@azure/keyvault-secrets");
var _identity = require("@azure/identity");
const DRIVER_NAME = "azure-key-vault";
module.exports = (0, _utils.defineDriver)(opts => {
  let keyVaultClient;
  const getKeyVaultClient = () => {
    if (keyVaultClient) {
      return keyVaultClient;
    }
    const {
      vaultName = null,
      serviceVersion = "7.3",
      pageSize = 25
    } = opts;
    if (!vaultName) {
      throw (0, _utils.createRequiredError)(DRIVER_NAME, "vaultName");
    }
    if (pageSize > 25) {
      throw (0, _utils.createError)(DRIVER_NAME, "`pageSize` cannot be greater than `25`");
    }
    const credential = new _identity.DefaultAzureCredential();
    const url = `https://${vaultName}.vault.azure.net`;
    keyVaultClient = new _keyvaultSecrets.SecretClient(url, credential, {
      serviceVersion
    });
    return keyVaultClient;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: getKeyVaultClient,
    async hasItem(key) {
      try {
        await getKeyVaultClient().getSecret(encode(key));
        return true;
      } catch {
        return false;
      }
    },
    async getItem(key) {
      try {
        const secret = await getKeyVaultClient().getSecret(encode(key));
        return secret.value;
      } catch {
        return null;
      }
    },
    async setItem(key, value) {
      await getKeyVaultClient().setSecret(encode(key), value);
    },
    async removeItem(key) {
      const poller = await getKeyVaultClient().beginDeleteSecret(encode(key));
      await poller.pollUntilDone();
      await getKeyVaultClient().purgeDeletedSecret(encode(key));
    },
    async getKeys() {
      const secrets = getKeyVaultClient().listPropertiesOfSecrets().byPage({
        maxPageSize: opts.pageSize || 25
      });
      const keys = [];
      for await (const page of secrets) {
        const pageKeys = page.map(secret => decode(secret.name));
        keys.push(...pageKeys);
      }
      return keys;
    },
    async getMeta(key) {
      const secret = await getKeyVaultClient().getSecret(encode(key));
      return {
        mtime: secret.properties.updatedOn,
        birthtime: secret.properties.createdOn,
        expireTime: secret.properties.expiresOn
      };
    },
    async clear() {
      const secrets = getKeyVaultClient().listPropertiesOfSecrets().byPage({
        maxPageSize: opts.pageSize || 25
      });
      for await (const page of secrets) {
        const deletionPromises = page.map(async secret => {
          const poller = await getKeyVaultClient().beginDeleteSecret(secret.name);
          await poller.pollUntilDone();
          await getKeyVaultClient().purgeDeletedSecret(secret.name);
        });
        await Promise.all(deletionPromises);
      }
    }
  };
});
const base64Map = {
  "=": "-e-",
  "+": "-p-",
  "/": "-s-"
};
function encode(value) {
  let encoded = Buffer.from(value).toString("base64");
  for (const key in base64Map) {
    encoded = encoded.replace(new RegExp(key.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&"), "g"), base64Map[key]);
  }
  return encoded;
}
function decode(value) {
  let decoded = value;
  const search = new RegExp(Object.values(base64Map).join("|"), "g");
  decoded = decoded.replace(search, match => {
    return Object.keys(base64Map).find(key => base64Map[key] === match);
  });
  return Buffer.from(decoded, "base64").toString();
}