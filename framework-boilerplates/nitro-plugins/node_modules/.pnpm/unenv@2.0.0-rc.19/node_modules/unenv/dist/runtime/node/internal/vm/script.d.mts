import type nodeVm from "node:vm";
export declare class Script implements nodeVm.Script {
	runInContext(contextifiedObject: nodeVm.Context, options?: nodeVm.RunningScriptOptions | undefined);
	runInNewContext(contextObject?: nodeVm.Context | undefined, options?: nodeVm.RunningScriptInNewContextOptions | undefined);
	runInThisContext(options?: nodeVm.RunningScriptOptions | undefined);
	createCachedData(): Buffer;
}
