import { defineNitroPreset } from "nitropack/kit";
const renderCom = defineNitroPreset(
  {
    extends: "node-server"
  },
  {
    name: "render-com",
    url: import.meta.url
  }
);
export default [renderCom];
