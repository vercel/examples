import { openKv } from "@deno/kv";
import { defineDriver } from "./utils/index.mjs";
import denoKV from "./deno-kv.mjs";
const DRIVER_NAME = "deno-kv-node";
export default defineDriver(
  (opts = {}) => {
    const baseDriver = denoKV({
      ...opts,
      openKv: () => openKv(opts.path, opts.openKvOptions)
    });
    return {
      ...baseDriver,
      getInstance() {
        return baseDriver.getInstance();
      },
      name: DRIVER_NAME
    };
  }
);
