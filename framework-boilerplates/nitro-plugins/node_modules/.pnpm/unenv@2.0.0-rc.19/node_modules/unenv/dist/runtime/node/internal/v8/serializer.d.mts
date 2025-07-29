import type nodeV8 from "node:v8";
export declare class Serializer implements nodeV8.Serializer {
	writeHeader();
	writeValue(val: any): boolean;
	releaseBuffer(): Buffer;
	transferArrayBuffer(id: number, arrayBuffer: ArrayBuffer);
	writeDouble(value: number);
	writeUint32(value: number);
	writeUint64(hi: number, lo: number);
	writeRawBytes(buffer: NodeJS.TypedArray);
}
export declare class DefaultSerializer extends Serializer {}
