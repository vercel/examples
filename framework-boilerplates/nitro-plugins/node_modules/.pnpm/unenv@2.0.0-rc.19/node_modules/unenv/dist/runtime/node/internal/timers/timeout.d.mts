export declare class Timeout<TArgs extends any[]> implements NodeJS.Timeout {
	constructor(callback: TimerHandler, args: TArgs);
	close(): this;
	_onTimeout(...args: any[]): void;
	ref();
	unref();
	hasRef(): boolean;
	refresh();
	[Symbol.dispose]();
	[Symbol.toPrimitive](): number;
}
