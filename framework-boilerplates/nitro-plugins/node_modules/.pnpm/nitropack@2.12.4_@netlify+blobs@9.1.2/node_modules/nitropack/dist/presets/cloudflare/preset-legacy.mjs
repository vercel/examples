import { defineNitroPreset } from "nitropack/kit";
import { writeFile } from "nitropack/kit";
import { resolve } from "pathe";
const cloudflare = defineNitroPreset(
  {
    extends: "base-worker",
    entry: "./runtime/cloudflare-worker",
    exportConditions: ["workerd"],
    commands: {
      preview: "npx wrangler dev {{ output.serverDir }}/index.mjs --site {{ output.publicDir }}",
      deploy: "npx wrangler deploy"
    },
    wasm: {
      lazy: true
    },
    hooks: {
      async compiled(nitro) {
        await writeFile(
          resolve(nitro.options.output.dir, "package.json"),
          JSON.stringify({ private: true, main: "./server/index.mjs" }, null, 2)
        );
        await writeFile(
          resolve(nitro.options.output.dir, "package-lock.json"),
          JSON.stringify({ lockfileVersion: 1 }, null, 2)
        );
      }
    }
  },
  {
    name: "cloudflare-worker",
    aliases: ["cloudflare"],
    url: import.meta.url
  }
);
const cloudflareModuleLegacy = defineNitroPreset(
  {
    extends: "base-worker",
    entry: "./runtime/cloudflare-module-legacy",
    exportConditions: ["workerd"],
    commands: {
      preview: "npx wrangler dev {{ output.serverDir }}/index.mjs --site {{ output.publicDir }}",
      deploy: "npx wrangler deploy"
    },
    rollupConfig: {
      external: "__STATIC_CONTENT_MANIFEST",
      output: {
        format: "esm",
        exports: "named",
        inlineDynamicImports: false
      }
    },
    wasm: {
      lazy: false,
      esmImport: true
    },
    hooks: {
      async compiled(nitro) {
        await writeFile(
          resolve(nitro.options.output.dir, "package.json"),
          JSON.stringify({ private: true, main: "./server/index.mjs" }, null, 2)
        );
        await writeFile(
          resolve(nitro.options.output.dir, "package-lock.json"),
          JSON.stringify({ lockfileVersion: 1 }, null, 2)
        );
      }
    }
  },
  {
    name: "cloudflare-module-legacy",
    aliases: ["cloudflare-module"],
    url: import.meta.url
  }
);
export default [cloudflare, cloudflareModuleLegacy];
