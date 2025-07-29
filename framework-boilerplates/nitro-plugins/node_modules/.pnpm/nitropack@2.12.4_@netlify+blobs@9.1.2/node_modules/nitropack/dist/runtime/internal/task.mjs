import { Cron } from "croner";
import { createError } from "h3";
import { isTest } from "std-env";
import { scheduledTasks, tasks } from "#nitro-internal-virtual/tasks";
export function defineTask(def) {
  if (typeof def.run !== "function") {
    def.run = () => {
      throw new TypeError("Task must implement a `run` method!");
    };
  }
  return def;
}
const __runningTasks__ = {};
export async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}
export function startScheduleRunner() {
  if (!scheduledTasks || scheduledTasks.length === 0 || isTest) {
    return;
  }
  const payload = {
    scheduledTime: Date.now()
  };
  for (const schedule of scheduledTasks) {
    const cron = new Cron(schedule.cron, async () => {
      await Promise.all(
        schedule.tasks.map(
          (name) => runTask(name, {
            payload,
            context: {}
          }).catch((error) => {
            console.error(
              `Error while running scheduled task "${name}"`,
              error
            );
          })
        )
      );
    });
  }
}
export function getCronTasks(cron) {
  return (scheduledTasks || []).find((task) => task.cron === cron)?.tasks || [];
}
export function runCronTasks(cron, ctx) {
  return Promise.all(getCronTasks(cron).map((name) => runTask(name, ctx)));
}
