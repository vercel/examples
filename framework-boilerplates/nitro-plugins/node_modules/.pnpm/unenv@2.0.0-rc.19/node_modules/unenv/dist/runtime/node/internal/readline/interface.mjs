import { EventEmitter } from "node:events";
export class Interface extends EventEmitter {
	terminal = false;
	line = "";
	cursor = 0;
	getPrompt() {
		return "";
	}
	setPrompt(prompt) {}
	prompt(preserveCursor) {}
	question(query, options, callback) {
		callback && typeof callback === "function" && callback("");
	}
	resume() {
		return this;
	}
	close() {}
	write(data, key) {}
	getCursorPos() {
		return {
			rows: 0,
			cols: 0
		};
	}
	pause() {
		return this;
	}
	async *[Symbol.asyncIterator]() {
		yield "";
	}
}
