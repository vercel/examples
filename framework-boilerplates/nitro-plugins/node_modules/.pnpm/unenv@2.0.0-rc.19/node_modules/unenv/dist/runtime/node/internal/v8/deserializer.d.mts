import type nodeV8 from "node:v8";
export declare class Deserializer implements nodeV8.Deserializer {
	readHeader(): boolean;
	readValue();
	transferArrayBuffer(id: number, arrayBuffer: ArrayBuffer);
	getWireFormatVersion(): number;
	readUint32(): number;
	readUint64(): [number, number];
	readDouble(): number;
	readRawBytes(length: number): Buffer;
}
export declare class DefaultDeserializer extends Deserializer {}
