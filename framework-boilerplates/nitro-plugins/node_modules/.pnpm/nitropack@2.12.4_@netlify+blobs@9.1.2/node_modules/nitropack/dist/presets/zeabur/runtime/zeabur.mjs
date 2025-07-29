import "#nitro-internal-pollyfills";
import { toNodeListener } from "h3";
import { useNitroApp } from "nitropack/runtime";
const handler = toNodeListener(useNitroApp().h3App);
const listener = function(req, res) {
  return handler(req, res);
};
export default listener;
