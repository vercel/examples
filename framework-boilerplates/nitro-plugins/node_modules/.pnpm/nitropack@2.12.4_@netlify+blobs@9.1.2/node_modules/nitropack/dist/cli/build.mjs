import nodeCrypto from 'node:crypto';
import { defineCommand } from 'citty';
import { createNitro, prepare, copyPublicAssets, prerender, build as build$1 } from 'nitropack/core';
import { resolve } from 'pathe';
import { c as commonArgs } from './common.mjs';

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const build = defineCommand({
  meta: {
    name: "build",
    description: "Build nitro project for production"
  },
  args: {
    ...commonArgs,
    minify: {
      type: "boolean",
      description: "Minify the output (overrides preset defaults you can also use `--no-minify` to disable)."
    },
    preset: {
      type: "string",
      description: "The build preset to use (you can also use `NITRO_PRESET` environment variable)."
    },
    compatibilityDate: {
      type: "string",
      description: "The date to use for preset compatibility (you can also use `NITRO_COMPATIBILITY_DATE` environment variable)."
    }
  },
  async run({ args }) {
    const rootDir = resolve(args.dir || args._dir || ".");
    const nitro = await createNitro(
      {
        rootDir,
        dev: false,
        minify: args.minify,
        preset: args.preset
      },
      {
        compatibilityDate: args.compatibilityDate
      }
    );
    await prepare(nitro);
    await copyPublicAssets(nitro);
    await prerender(nitro);
    await build$1(nitro);
    await nitro.close();
  }
});

export { build as default };
