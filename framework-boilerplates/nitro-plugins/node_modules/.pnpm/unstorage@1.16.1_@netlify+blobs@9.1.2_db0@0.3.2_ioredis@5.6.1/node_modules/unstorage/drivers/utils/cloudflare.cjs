"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBinding = getBinding;
exports.getKVBinding = getKVBinding;
exports.getR2Binding = getR2Binding;
var _index = require("./index.cjs");
function getBinding(binding) {
  let bindingName = "[binding]";
  if (typeof binding === "string") {
    bindingName = binding;
    binding = globalThis[bindingName] || globalThis.__env__?.[bindingName];
  }
  if (!binding) {
    throw (0, _index.createError)("cloudflare", `Invalid binding \`${bindingName}\`: \`${binding}\``);
  }
  for (const key of ["get", "put", "delete"]) {
    if (!(key in binding)) {
      throw (0, _index.createError)("cloudflare", `Invalid binding \`${bindingName}\`: \`${key}\` key is missing`);
    }
  }
  return binding;
}
function getKVBinding(binding = "STORAGE") {
  return getBinding(binding);
}
function getR2Binding(binding = "BUCKET") {
  return getBinding(binding);
}