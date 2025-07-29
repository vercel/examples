import { defineNitroPreset } from "nitropack/kit";
const heroku = defineNitroPreset(
  {
    extends: "node-server"
  },
  {
    name: "heroku",
    url: import.meta.url
  }
);
export default [heroku];
