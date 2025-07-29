const require_context = require('../../context-DwbtaXxf.cjs');
const require_context$1 = require('../../context-Df-kn6rn.cjs');

//#region src/webpack/loaders/transform.ts
async function transform(source, map) {
	const callback = this.async();
	const { plugin } = this.query;
	if (!plugin?.transform) return callback(null, source, map);
	const context = require_context$1.createContext$1(this);
	const { handler, filter } = require_context.normalizeObjectHook("transform", plugin.transform);
	if (!filter(this.resource, source)) return callback(null, source, map);
	try {
		const res = await handler.call(Object.assign({}, require_context$1.createBuildContext$1({
			addWatchFile: (file) => {
				this.addDependency(file);
			},
			getWatchFiles: () => {
				return this.getDependencies();
			}
		}, this._compiler, this._compilation, this), context), source, this.resource);
		if (res == null) callback(null, source, map);
		else if (typeof res !== "string") callback(null, res.code, map == null ? map : res.map || map);
		else callback(null, res, map);
	} catch (error) {
		if (error instanceof Error) callback(error);
		else callback(new Error(String(error)));
	}
}

//#endregion
module.exports = transform;