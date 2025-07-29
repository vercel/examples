export class Deserializer {
	readHeader() {
		return false;
	}
	readValue() {}
	transferArrayBuffer(id, arrayBuffer) {}
	getWireFormatVersion() {
		return 0;
	}
	readUint32() {
		return 0;
	}
	readUint64() {
		return [0, 0];
	}
	readDouble() {
		return 0;
	}
	readRawBytes(length) {
		return Buffer.from("");
	}
}
export class DefaultDeserializer extends Deserializer {}
