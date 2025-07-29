// https://www.npmjs.com/package/fsevents
declare const _default: {
	watch(_dir: string, _cb: (...args: any[]) => any);
	getInfo(path: string, _flags: number, _id: string): {
		event: string;
		type: string;
		flags: number;
		changes: {
			inode: boolean;
			finder: boolean;
			access: boolean;
			xattrs: boolean;
		};
	};
};
export default _default;
