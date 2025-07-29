export class Readline {
	clearLine(dir) {
		return this;
	}
	clearScreenDown() {
		return this;
	}
	commit() {
		return Promise.resolve();
	}
	cursorTo(x, y) {
		return this;
	}
	moveCursor(dx, dy) {
		return this;
	}
	rollback() {
		return this;
	}
}
