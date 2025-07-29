export const log = (...args) => {
	console.log(...args);
};
export const debuglog = (section, _cb) => {
	const fn = (msg, ...params) => {
		if (fn.enabled) {
			console.debug(`[${section}] ${msg}`, ...params);
		}
	};
	fn.enabled = true;
	return fn;
};
export const debug = debuglog;
// @ts-ignore
export const inspect = (object) => JSON.stringify(object, null, 2);
export const format = (...args) => _format(...args);
export const formatWithOptions = (_options, ...args) => _format(...args);
// Source: https://github.com/tmpfs/format-util/blob/0c989942c959b179eec294a4e725afd63e743f18/format.js
function _format(fmt, ...args) {
	const re = /(%?)(%([djos]))/g;
	if (args.length > 0) {
		fmt = fmt.replace(re, (match, escaped, ptn, flag) => {
			let arg = args.shift();
			switch (flag) {
				case "o":
					if (Array.isArray(arg)) {
						arg = JSON.stringify(arg);
						break;
					}
					break;
				case "s":
					arg = "" + arg;
					break;
				case "d":
					arg = Number(arg);
					break;
				case "j":
					arg = JSON.stringify(arg);
					break;
			}
			if (!escaped) {
				return arg;
			}
			args.unshift(arg);
			return match;
		});
	}
	// arguments remain after formatting
	if (args.length > 0) {
		fmt += " " + args.join(" ");
	}
	// update escaped %% values
	fmt = fmt.replace(/%{2}/g, "%");
	return "" + fmt;
}
