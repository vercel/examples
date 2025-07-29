#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { version } from 'nitropack/meta';

const main = defineCommand({
  meta: {
    name: "nitro",
    description: "Nitro CLI",
    version: version
  },
  subCommands: {
    dev: () => import('./dev.mjs').then((r) => r.default),
    build: () => import('./build.mjs').then((r) => r.default),
    prepare: () => import('./prepare.mjs').then((r) => r.default),
    task: () => import('./index2.mjs').then((r) => r.default)
  }
});
runMain(main);
