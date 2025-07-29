import type nodeReadline from "node:readline";
import type { Abortable } from "node:events";
import { EventEmitter } from "node:events";
export declare class Interface extends EventEmitter implements nodeReadline.Interface {
	terminal: boolean;
	line: string;
	cursor: number;
	getPrompt(): string;
	setPrompt(prompt: string): void;
	prompt(preserveCursor?: boolean | undefined): void;
	question(query: string, callback: (answer: string) => void): void;
	question(query: string, options: Abortable, callback: (answer: string) => void): void;
	resume();
	close();
	write(data: string | Buffer, key?: nodeReadline.Key | undefined): void;
	write(data: string | Buffer | null | undefined, key: nodeReadline.Key): void;
	getCursorPos(): nodeReadline.CursorPos;
	pause();
	[Symbol.asyncIterator](): NodeJS.AsyncIterator<string>;
}
