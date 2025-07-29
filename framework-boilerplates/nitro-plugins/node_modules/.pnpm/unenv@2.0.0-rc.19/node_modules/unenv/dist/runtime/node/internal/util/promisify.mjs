const customSymbol = /* @__PURE__ */ Symbol("customPromisify");
function _promisify(fn) {
	if (fn[customSymbol]) {
		return fn[customSymbol];
	}
	return function(...args) {
		return new Promise((resolve, reject) => {
			try {
				// @ts-ignore
				fn.call(this, ...args, (err, val) => {
					if (err) {
						return reject(err);
					}
					resolve(val);
				});
			} catch (error) {
				reject(error);
			}
		});
	};
}
// @ts-ignore
export const promisify = /* @__PURE__ */ Object.assign(_promisify, { custom: customSymbol });
