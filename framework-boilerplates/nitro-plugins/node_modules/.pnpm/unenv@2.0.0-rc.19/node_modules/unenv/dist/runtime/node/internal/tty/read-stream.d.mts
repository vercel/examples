import type nodeTty from "node:tty";
export declare class ReadStream implements Partial<nodeTty.ReadStream> {
	fd: number;
	isRaw: boolean;
	isTTY: boolean;
	constructor(fd: number);
	setRawMode(mode: boolean): nodeTty.ReadStream;
}
