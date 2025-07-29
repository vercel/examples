export declare class Immediate<TArgs extends any[]> implements NodeJS.Immediate {
	_onImmediate: (...args: TArgs) => void;
	private _timeout?;
	constructor(callback: (...args: TArgs) => void, args: TArgs);
	ref(): this;
	unref(): this;
	hasRef(): boolean;
	[Symbol.dispose]();
}
