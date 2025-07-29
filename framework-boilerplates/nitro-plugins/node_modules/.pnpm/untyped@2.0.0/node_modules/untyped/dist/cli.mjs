#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineCommand, runMain } from 'citty';

const load = defineCommand({
  meta: {
    name: "load",
    description: "Load a schema from the specified entry path"
  },
  args: {
    entryPath: {
      type: "positional",
      required: true,
      description: "Path to the entry file"
    },
    write: {
      type: "string",
      required: false,
      description: "Write the output to a file"
    },
    ignoreDefaults: {
      type: "boolean",
      required: false,
      description: "Ignore default values"
    }
  },
  async run({ args }) {
    const { loadSchema } = await import('./loader/loader.mjs');
    const cwd = process.cwd();
    const schema = await loadSchema(resolve(cwd, args.entryPath), {
      ignoreDefaults: args.ignoreDefaults
    });
    if (args.write) {
      const json = JSON.stringify(schema, null, 2);
      const outfile = resolve(
        cwd,
        args.write === "true" ? "schema.json" : args.write
      );
      await writeFile(outfile, json);
    } else {
      console.log(schema);
    }
  }
});
const cli = defineCommand({
  meta: {
    name: "untyped",
    description: "CLI tool for untyped operations"
  },
  subCommands: {
    load
  }
});
runMain(cli).catch((error) => {
  console.error(error);
  process.exit(1);
});
