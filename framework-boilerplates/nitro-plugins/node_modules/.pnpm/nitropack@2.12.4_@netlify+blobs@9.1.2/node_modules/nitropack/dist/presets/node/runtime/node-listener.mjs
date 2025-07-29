import "#nitro-internal-pollyfills";
import { toNodeListener } from "h3";
import { useNitroApp } from "nitropack/runtime";
import {
  startScheduleRunner,
  trapUnhandledNodeErrors
} from "nitropack/runtime/internal";
const nitroApp = useNitroApp();
export const listener = toNodeListener(nitroApp.h3App);
export const websocket = import.meta._websocket ? nitroApp.h3App.websocket : void 0;
export const handler = listener;
trapUnhandledNodeErrors();
if (import.meta._tasks) {
  startScheduleRunner();
}
