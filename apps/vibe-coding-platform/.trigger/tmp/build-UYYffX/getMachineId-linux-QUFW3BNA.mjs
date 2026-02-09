import {
  esm_exports,
  init_esm as init_esm2
} from "./chunk-ZOPV4KI4.mjs";
import {
  __commonJS,
  __name,
  __require,
  __toCommonJS,
  init_esm
} from "./chunk-3R76H35D.mjs";

// ../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-linux.js
var require_getMachineId_linux = __commonJS({
  "../../../../../.npm/_npx/f51a09bd0abf5f10/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-linux.js"(exports) {
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMachineId = void 0;
    var fs_1 = __require("fs");
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    async function getMachineId() {
      const paths = ["/etc/machine-id", "/var/lib/dbus/machine-id"];
      for (const path of paths) {
        try {
          const result = await fs_1.promises.readFile(path, { encoding: "utf8" });
          return result.trim();
        } catch (e) {
          api_1.diag.debug(`error reading machine id: ${e}`);
        }
      }
      return void 0;
    }
    __name(getMachineId, "getMachineId");
    exports.getMachineId = getMachineId;
  }
});
export default require_getMachineId_linux();
//# sourceMappingURL=getMachineId-linux-QUFW3BNA.mjs.map
