import "#nitro-internal-pollyfills";
import { builder } from "@netlify/functions";
import { lambda } from "./netlify-lambda.mjs";
export const handler = builder(lambda);
