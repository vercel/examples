import { defineCommand } from 'citty';
import { createNitro, writeTypes } from 'nitropack/core';
import { resolve } from 'pathe';
import { c as commonArgs } from './common.mjs';

const prepare = defineCommand({
  meta: {
    name: "prepare",
    description: "Generate types for the project"
  },
  args: {
    ...commonArgs
  },
  async run({ args }) {
    const rootDir = resolve(args.dir || args._dir || ".");
    const nitro = await createNitro({ rootDir });
    await writeTypes(nitro);
  }
});

export { prepare as default };
