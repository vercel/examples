import { createError } from "./index.mjs";
export function getBinding(binding) {
  let bindingName = "[binding]";
  if (typeof binding === "string") {
    bindingName = binding;
    binding = globalThis[bindingName] || globalThis.__env__?.[bindingName];
  }
  if (!binding) {
    throw createError(
      "cloudflare",
      `Invalid binding \`${bindingName}\`: \`${binding}\``
    );
  }
  for (const key of ["get", "put", "delete"]) {
    if (!(key in binding)) {
      throw createError(
        "cloudflare",
        `Invalid binding \`${bindingName}\`: \`${key}\` key is missing`
      );
    }
  }
  return binding;
}
export function getKVBinding(binding = "STORAGE") {
  return getBinding(binding);
}
export function getR2Binding(binding = "BUCKET") {
  return getBinding(binding);
}
