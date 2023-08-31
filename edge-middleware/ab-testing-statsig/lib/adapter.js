var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.EdgeConfigDataAdapter = void 0
const edge_config_1 = require('@vercel/edge-config')
class EdgeConfigDataAdapter {
  constructor(key, connectionString = process.env.EDGE_CONFIG) {
    this.supportConfigSpecPolling = false
    this.configSpecsKey = key
    this.edgeConfigClient = (0, edge_config_1.createClient)(connectionString)
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  get(key) {
    console.log('get key', key)
    return __awaiter(this, void 0, void 0, function* () {
      if (key !== 'statsig.cache') {
        return {
          error: new Error(`Edge Config Adapter Only Supports Config Specs`),
        }
      }
      const data = yield this.edgeConfigClient.get(this.configSpecsKey)
      if (data === undefined) {
        return { error: new Error(`key (${key}) does not exist`) }
      }
      // console.log("returning here")
      return { result: JSON.stringify(data) }
    })
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  set(key, value, time) {
    return __awaiter(this, void 0, void 0, function* () {
      // no-op. Statsig's Edge Config integration keeps config specs synced through Statsig's service
    })
  }
  initialize() {
    console.log('initialize sdk reading')
    return __awaiter(this, void 0, void 0, function* () {
      const data = yield this.edgeConfigClient.get(this.configSpecsKey)
      if (data) {
        this.supportConfigSpecPolling = true
      }
    })
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown() {
    return __awaiter(this, void 0, void 0, function* () {})
  }
  supportsPollingUpdatesFor(key) {
    if (key === 'statsig.cache') {
      return this.supportConfigSpecPolling
    }
    return false
  }
}
exports.EdgeConfigDataAdapter = EdgeConfigDataAdapter
