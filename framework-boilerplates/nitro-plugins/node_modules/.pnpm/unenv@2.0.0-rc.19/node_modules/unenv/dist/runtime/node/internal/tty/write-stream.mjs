export class WriteStream {
	fd;
	columns = 80;
	rows = 24;
	isTTY = false;
	constructor(fd) {
		this.fd = fd;
	}
	clearLine(dir, callback) {
		callback && callback();
		return false;
	}
	clearScreenDown(callback) {
		callback && callback();
		return false;
	}
	cursorTo(x, y, callback) {
		callback && typeof callback === "function" && callback();
		return false;
	}
	moveCursor(dx, dy, callback) {
		callback && callback();
		return false;
	}
	getColorDepth(env) {
		return 1;
	}
	hasColors(count, env) {
		return false;
	}
	getWindowSize() {
		return [this.columns, this.rows];
	}
	write(str, encoding, cb) {
		if (str instanceof Uint8Array) {
			str = new TextDecoder().decode(str);
		}
		try {
			console.log(str);
		} catch {}
		cb && typeof cb === "function" && cb();
		return false;
	}
}
