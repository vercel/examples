import cluster from "node:cluster";
import os from "node:os";
import {
  getGracefulShutdownConfig,
  trapUnhandledNodeErrors
} from "nitropack/runtime/internal";
function runMaster() {
  const numberOfWorkers = Number.parseInt(process.env.NITRO_CLUSTER_WORKERS || "") || (os.cpus().length > 0 ? os.cpus().length : 1);
  for (let i = 0; i < numberOfWorkers; i++) {
    cluster.fork();
  }
  let isShuttingDown = false;
  cluster.on("exit", () => {
    if (!isShuttingDown) {
      cluster.fork();
    }
  });
  const shutdownConfig = getGracefulShutdownConfig();
  if (!shutdownConfig.disabled) {
    async function onShutdown() {
      if (isShuttingDown) {
        return;
      }
      isShuttingDown = true;
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Timeout reached for graceful shutdown. Forcing exit.");
          resolve();
        }, shutdownConfig.timeout);
        cluster.on("exit", () => {
          if (Object.values(cluster.workers || {}).every((w) => !w || w.isDead())) {
            clearTimeout(timeout);
            resolve();
          } else {
          }
        });
      });
      if (shutdownConfig.forceExit) {
        process.exit(0);
      }
    }
    for (const signal of shutdownConfig.signals) {
      process.once(signal, onShutdown);
    }
  }
}
function runWorker() {
  import("./node-server.mjs").catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
trapUnhandledNodeErrors();
if (cluster.isPrimary) {
  runMaster();
} else {
  runWorker();
}
