import { defineNitroPreset } from "nitropack/kit";
const cleavr = defineNitroPreset(
  {
    extends: "node-server"
  },
  {
    name: "cleavr",
    stdName: "cleavr",
    url: import.meta.url
  }
);
export default [cleavr];
