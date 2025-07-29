import { defineNitroPreset } from "nitropack/kit";
const flightControl = defineNitroPreset(
  {
    extends: "node-server"
  },
  {
    name: "flight-control",
    url: import.meta.url
  }
);
export default [flightControl];
