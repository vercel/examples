export class Serializer {
	writeHeader() {}
	writeValue(val) {
		return false;
	}
	releaseBuffer() {
		return Buffer.from("");
	}
	transferArrayBuffer(id, arrayBuffer) {}
	writeDouble(value) {}
	writeUint32(value) {}
	writeUint64(hi, lo) {}
	writeRawBytes(buffer) {}
}
export class DefaultSerializer extends Serializer {}
