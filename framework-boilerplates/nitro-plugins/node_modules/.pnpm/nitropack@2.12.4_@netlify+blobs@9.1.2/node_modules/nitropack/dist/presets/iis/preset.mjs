import { defineNitroPreset } from "nitropack/kit";
import { writeIISFiles, writeIISNodeFiles } from "./utils.mjs";
const iisHandler = defineNitroPreset(
  {
    extends: "node-server",
    hooks: {
      async compiled(nitro) {
        await writeIISFiles(nitro);
      }
    }
  },
  {
    name: "iis-handler",
    aliases: ["iis"],
    url: import.meta.url
  }
);
const iisNode = defineNitroPreset(
  {
    extends: "node-server",
    hooks: {
      async compiled(nitro) {
        await writeIISNodeFiles(nitro);
      }
    }
  },
  {
    name: "iis-node",
    url: import.meta.url
  }
);
export default [iisHandler, iisNode];
