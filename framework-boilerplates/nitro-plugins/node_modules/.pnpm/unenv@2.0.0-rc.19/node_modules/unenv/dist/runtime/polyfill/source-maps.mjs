// This polyfill enables `node --enable-source-maps` effect in supported Node.js versions (22.14+, 23.7+)
// Docs: https://nodejs.org/api/module.html#modulesetsourcemapssupportenabled-options
try {
	const nodeModule = globalThis.process?.getBuiltinModule?.("node:module");
	// @ts-expect-error TODO: update Node.js types
	if (nodeModule && !nodeModule.getSourceMapsSupport?.()?.enabled) {
		// @ts-expect-error
		nodeModule.setSourceMapsSupport?.(true, {
			generatedCode: true,
			nodeModules: true
		});
	}
} catch (error) {
	console.warn("Failed to enable source maps support:", error);
}
