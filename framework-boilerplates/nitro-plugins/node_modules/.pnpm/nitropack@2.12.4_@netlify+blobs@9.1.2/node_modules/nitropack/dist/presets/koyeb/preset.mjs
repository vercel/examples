import { defineNitroPreset } from "nitropack/kit";
const koyeb = defineNitroPreset(
  {
    extends: "node-server"
  },
  {
    name: "koyeb",
    url: import.meta.url
  }
);
export default [koyeb];
