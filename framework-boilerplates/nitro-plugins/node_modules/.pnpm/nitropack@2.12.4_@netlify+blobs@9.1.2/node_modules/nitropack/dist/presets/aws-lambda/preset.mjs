import { defineNitroPreset } from "nitropack/kit";
const awsLambda = defineNitroPreset(
  {
    entry: "./runtime/aws-lambda",
    awsLambda: {
      streaming: false
    },
    hooks: {
      "rollup:before": (nitro, rollupConfig) => {
        if (nitro.options.awsLambda?.streaming) {
          rollupConfig.input += "-streaming";
        }
      }
    }
  },
  {
    name: "aws-lambda",
    url: import.meta.url
  }
);
export default [awsLambda];
