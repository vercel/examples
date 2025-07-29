import { builtnNodeModules } from "./node-compat/deno.mjs";
export const unenvDenoPreset = {
  meta: {
    name: "nitro-deno",
    url: import.meta.url
  },
  external: builtnNodeModules.map((m) => `node:${m}`),
  alias: {
    // (native)
    ...Object.fromEntries(
      [...builtnNodeModules, "sys"].flatMap((m) => [
        [m, `node:${m}`],
        [`node:${m}`, `node:${m}`]
      ])
    )
  },
  inject: {
    performance: false
  }
};
