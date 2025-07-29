import timers from "node:timers/promises";
import type { TimerOptions } from "node:timers";
export declare class Scheduler implements timers.Scheduler {
	wait(delay?: number | undefined, options?: Pick<TimerOptions, "signal"> | undefined);
	yield();
}
