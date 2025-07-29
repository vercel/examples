export class File extends Blob {
	__unenv__ = true;
	size = 0;
	type = "";
	name = "";
	lastModified = 0;
	constructor(...args) {
		super(...args);
		throw new Error("[unenv] buffer.File is not implemented");
	}
	arrayBuffer() {
		throw new Error("Not implemented");
	}
	slice() {
		throw new Error("Not implemented");
	}
	text() {
		throw new Error("Not implemented");
	}
	stream() {
		throw new Error("Not implemented");
	}
	bytes() {
		throw new Error("Not implemented");
	}
}
