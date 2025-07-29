import nodeCrypto from 'node:crypto';
import { defineCommand } from 'citty';
import { consola } from 'consola';
import { getArgs, parseArgs } from 'listhen/cli';
import { createNitro, createDevServer, prepare, build } from 'nitropack/core';
import { resolve } from 'pathe';
import { c as commonArgs } from './common.mjs';

const hmrKeyRe = /^runtimeConfig\.|routeRules\./;
if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const dev = defineCommand({
  meta: {
    name: "dev",
    description: "Start the development server"
  },
  args: {
    ...commonArgs,
    ...getArgs()
  },
  async run({ args }) {
    const rootDir = resolve(args.dir || args._dir || ".");
    let nitro;
    const reload = async () => {
      if (nitro) {
        consola.info("Restarting dev server...");
        if ("unwatch" in nitro.options._c12) {
          await nitro.options._c12.unwatch();
        }
        await nitro.close();
      }
      nitro = await createNitro(
        {
          rootDir,
          dev: true,
          _cli: { command: "dev" }
        },
        {
          watch: true,
          c12: {
            async onUpdate({ getDiff, newConfig }) {
              const diff = getDiff();
              if (diff.length === 0) {
                return;
              }
              consola.info(
                "Nitro config updated:\n" + diff.map((entry) => `  ${entry.toString()}`).join("\n")
              );
              await (diff.every((e) => hmrKeyRe.test(e.key)) ? nitro.updateConfig(newConfig.config || {}) : reload());
            }
          }
        }
      );
      nitro.hooks.hookOnce("restart", reload);
      const server = createDevServer(nitro);
      const listhenOptions = parseArgs(args);
      await server.listen(listhenOptions.port || 3e3, listhenOptions);
      await prepare(nitro);
      await build(nitro);
    };
    await reload();
  }
});

export { dev as default };
