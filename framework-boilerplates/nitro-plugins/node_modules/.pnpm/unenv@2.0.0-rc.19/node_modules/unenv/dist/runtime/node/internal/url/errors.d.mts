export declare class ERR_INVALID_ARG_VALUE extends TypeError {
	code: string;
	constructor(name: string, value: unknown, reason: string);
}
export declare class ERR_INVALID_ARG_TYPE extends TypeError {
	code: string;
	constructor(name: string, expected: unknown, actual: unknown);
}
export declare class ERR_INVALID_URL extends TypeError {
	code: string;
	input: string;
	base?: string;
	constructor(input: string, base?: string);
}
export declare class ERR_INVALID_URL_SCHEME extends TypeError {
	code: string;
	constructor(expected: string);
}
export declare class ERR_INVALID_FILE_URL_PATH extends TypeError {
	code: string;
	constructor(path: string);
}
export declare class ERR_INVALID_FILE_URL_HOST extends TypeError {
	code: string;
	constructor(host: string);
}
