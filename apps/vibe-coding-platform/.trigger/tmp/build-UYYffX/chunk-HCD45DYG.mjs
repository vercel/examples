import {
  __name,
  init_esm
} from "./chunk-3R76H35D.mjs";

// node_modules/uncrypto/dist/crypto.node.mjs
init_esm();
import nodeCrypto from "node:crypto";
var subtle = nodeCrypto.webcrypto?.subtle || {};
var randomUUID = /* @__PURE__ */ __name(() => {
  return nodeCrypto.randomUUID();
}, "randomUUID");
var getRandomValues = /* @__PURE__ */ __name((array) => {
  return nodeCrypto.webcrypto.getRandomValues(array);
}, "getRandomValues");
var _crypto = {
  randomUUID,
  getRandomValues,
  subtle
};

export {
  subtle,
  randomUUID,
  getRandomValues,
  _crypto
};
//# sourceMappingURL=chunk-HCD45DYG.mjs.map
