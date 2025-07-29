import { defineCommand } from 'citty';

const index = defineCommand({
  meta: {
    name: "task",
    description: "Operate in nitro tasks (experimental)"
  },
  subCommands: {
    list: () => import('./list.mjs').then((r) => r.default),
    run: () => import('./run.mjs').then((r) => r.default)
  }
});

export { index as default };
