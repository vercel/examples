import { createNotImplementedError } from "../../../_internal/utils.mjs";
export class Script {
	runInContext(contextifiedObject, options) {
		throw createNotImplementedError("Script.runInContext");
	}
	runInNewContext(contextObject, options) {
		throw createNotImplementedError("Script.runInNewContext");
	}
	runInThisContext(options) {
		throw createNotImplementedError("Script.runInThisContext");
	}
	createCachedData() {
		throw createNotImplementedError("Script.createCachedData");
	}
}
