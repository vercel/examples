import { defineCommand } from 'citty';
import { consola } from 'consola';
import { loadOptions, listTasks } from 'nitropack/core';
import { resolve } from 'pathe';

const list = defineCommand({
  meta: {
    name: "run",
    description: "List available tasks (experimental)"
  },
  args: {
    dir: {
      type: "string",
      description: "project root directory"
    }
  },
  async run({ args }) {
    const cwd = resolve(args.dir || args.cwd || ".");
    const options = await loadOptions({ rootDir: cwd }).catch(() => void 0);
    const tasks = await listTasks({
      cwd,
      buildDir: options?.buildDir || ".nitro"
    });
    for (const [name, task] of Object.entries(tasks)) {
      consola.log(
        ` - \`${name}\`${task.meta?.description ? ` - ${task.meta.description}` : ""}`
      );
    }
  }
});

export { list as default };
