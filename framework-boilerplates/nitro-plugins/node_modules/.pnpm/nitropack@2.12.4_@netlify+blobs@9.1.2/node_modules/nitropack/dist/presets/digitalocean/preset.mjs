import { defineNitroPreset } from "nitropack/kit";
const digitalOcean = defineNitroPreset(
  {
    extends: "node-server"
  },
  {
    name: "digital-ocean",
    url: import.meta.url
  }
);
export default [digitalOcean];
