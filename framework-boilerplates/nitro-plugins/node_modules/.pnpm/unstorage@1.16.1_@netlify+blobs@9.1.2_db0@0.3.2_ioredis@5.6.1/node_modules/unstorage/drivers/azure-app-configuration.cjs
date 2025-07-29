"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _appConfiguration = require("@azure/app-configuration");
var _identity = require("@azure/identity");
const DRIVER_NAME = "azure-app-configuration";
module.exports = (0, _utils.defineDriver)((opts = {}) => {
  const labelFilter = opts.label || "\0";
  const keyFilter = opts.prefix ? `${opts.prefix}:*` : "*";
  const p = key => opts.prefix ? `${opts.prefix}:${key}` : key;
  const d = key => opts.prefix ? key.replace(opts.prefix, "") : key;
  let client;
  const getClient = () => {
    if (client) {
      return client;
    }
    if (!opts.endpoint && !opts.appConfigName && !opts.connectionString) {
      throw (0, _utils.createRequiredError)(DRIVER_NAME, ["endpoint", "appConfigName", "connectionString"]);
    }
    const appConfigEndpoint = opts.endpoint || `https://${opts.appConfigName}.azconfig.io`;
    if (opts.connectionString) {
      client = new _appConfiguration.AppConfigurationClient(opts.connectionString);
    } else {
      const credential = new _identity.DefaultAzureCredential();
      client = new _appConfiguration.AppConfigurationClient(appConfigEndpoint, credential);
    }
    return client;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: getClient,
    async hasItem(key) {
      try {
        await getClient().getConfigurationSetting({
          key: p(key),
          label: opts.label
        });
        return true;
      } catch {
        return false;
      }
    },
    async getItem(key) {
      try {
        const setting = await getClient().getConfigurationSetting({
          key: p(key),
          label: opts.label
        });
        return setting.value;
      } catch {
        return null;
      }
    },
    async setItem(key, value) {
      await getClient().setConfigurationSetting({
        key: p(key),
        value,
        label: opts.label
      });
      return;
    },
    async removeItem(key) {
      await getClient().deleteConfigurationSetting({
        key: p(key),
        label: opts.label
      });
      return;
    },
    async getKeys() {
      const settings = getClient().listConfigurationSettings({
        keyFilter,
        labelFilter,
        fields: ["key", "value", "label"]
      });
      const keys = [];
      for await (const setting of settings) {
        keys.push(d(setting.key));
      }
      return keys;
    },
    async getMeta(key) {
      const setting = await getClient().getConfigurationSetting({
        key: p(key),
        label: opts.label
      });
      return {
        mtime: setting.lastModified,
        etag: setting.etag,
        tags: setting.tags
      };
    },
    async clear() {
      const settings = getClient().listConfigurationSettings({
        keyFilter,
        labelFilter,
        fields: ["key", "value", "label"]
      });
      for await (const setting of settings) {
        await getClient().deleteConfigurationSetting({
          key: setting.key,
          label: setting.label
        });
      }
    }
  };
});