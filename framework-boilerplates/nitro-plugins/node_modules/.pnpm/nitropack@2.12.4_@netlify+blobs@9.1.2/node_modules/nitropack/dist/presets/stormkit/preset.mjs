import { defineNitroPreset } from "nitropack/kit";
const stormkit = defineNitroPreset(
  {
    entry: "./runtime/stormkit",
    output: {
      dir: "{{ rootDir }}/.stormkit",
      publicDir: "{{ rootDir }}/.stormkit/public/{{ baseURL }}"
    }
  },
  {
    name: "stormkit",
    stdName: "stormkit",
    url: import.meta.url
  }
);
export default [stormkit];
