import { normalizeObjectHook } from "../../context-D49cMElb.js";
import { normalizeAbsolutePath } from "../../webpack-like-CSbnjTNU.js";
import { createBuildContext$1 as createBuildContext, createContext$1 as createContext } from "../../context-DY6ggBKV.js";
import { decodeVirtualModuleId, isVirtualModuleId } from "../../utils-Cbrj-Du4.js";

//#region src/rspack/loaders/load.ts
async function load(source, map) {
	const callback = this.async();
	const { plugin } = this.query;
	let id = this.resource;
	if (!plugin?.load || !id) return callback(null, source, map);
	if (isVirtualModuleId(id, plugin)) id = decodeVirtualModuleId(id, plugin);
	const context = createContext(this);
	const { handler } = normalizeObjectHook("load", plugin.load);
	const res = await handler.call(Object.assign({}, this._compilation && createBuildContext(this._compiler, this._compilation, this), context), normalizeAbsolutePath(id));
	if (res == null) callback(null, source, map);
	else if (typeof res !== "string") callback(null, res.code, res.map ?? map);
	else callback(null, res, map);
}

//#endregion
export { load as default };