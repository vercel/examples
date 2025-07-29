import type nodeReadlinePromises from "node:readline/promises";
import type { Direction } from "node:readline";
export declare class Readline implements nodeReadlinePromises.Readline {
	clearLine(dir: Direction);
	clearScreenDown();
	commit(): Promise<void>;
	cursorTo(x: number, y?: number | undefined);
	moveCursor(dx: number, dy: number);
	rollback();
}
