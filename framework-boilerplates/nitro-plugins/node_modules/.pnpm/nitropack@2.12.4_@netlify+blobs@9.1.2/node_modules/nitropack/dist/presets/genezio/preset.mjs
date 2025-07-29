import { defineNitroPreset } from "nitropack/kit";
const genezio = defineNitroPreset(
  {
    extends: "aws_lambda"
  },
  {
    name: "genezio",
    url: import.meta.url
  }
);
export default [genezio];
