import { defineCommand } from 'citty';
import { consola } from 'consola';
import destr from 'destr';
import { loadOptions, runTask } from 'nitropack/core';
import { resolve } from 'pathe';

const run = defineCommand({
  meta: {
    name: "run",
    description: "Run a runtime task in the currently running dev server (experimental)"
  },
  args: {
    name: {
      type: "positional",
      description: "task name",
      required: true
    },
    dir: {
      type: "string",
      description: "project root directory"
    },
    payload: {
      type: "string",
      description: "payload json to pass to the task"
    }
  },
  async run({ args }) {
    const cwd = resolve(args.dir || args.cwd || ".");
    const options = await loadOptions({ rootDir: cwd }).catch(() => void 0);
    consola.info(`Running task \`${args.name}\`...`);
    let payload = destr(args.payload || "{}");
    if (typeof payload !== "object") {
      consola.error(
        `Invalid payload: \`${args.payload}\` (it should be a valid JSON object)`
      );
      payload = void 0;
    }
    try {
      const { result } = await runTask(
        {
          name: args.name,
          context: {},
          payload
        },
        {
          cwd,
          buildDir: options?.buildDir || ".nitro"
        }
      );
      consola.success("Result:", result);
    } catch (error) {
      consola.error(`Failed to run task \`${args.name}\`: ${error}`);
      process.exit(1);
    }
  }
});

export { run as default };
