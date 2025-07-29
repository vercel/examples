import { createDebugger } from "hookable";
import { defineNitroPlugin } from "./plugin.mjs";
export default defineNitroPlugin((nitro) => {
  createDebugger(nitro.hooks, { tag: "nitro-runtime" });
});
