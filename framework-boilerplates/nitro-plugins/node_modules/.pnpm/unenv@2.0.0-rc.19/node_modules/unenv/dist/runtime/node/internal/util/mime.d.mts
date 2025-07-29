import type { MIMEType as MIMETypeT, MIMEParams as MIMEParamsT } from "node:util";
// https://nodejs.org/api/util.html#class-utilmimetype
export declare class MIMEType implements MIMETypeT {
	readonly __unenv__: true;
	params;
	type: string;
	subtype: string;
	constructor(input: string | {
		toString: () => string;
	});
	get essence();
	toString();
}
// https://nodejs.org/api/util.html#util_class_util_mimeparams
export declare class MIMEParams extends Map<string, string> implements MIMEParamsT {
	readonly __unenv__: true;
	get(name: string): any;
	toString();
}
