const require_context = require('./context-DwbtaXxf.cjs');
const node_fs = require_context.__toESM(require("node:fs"));
const node_path = require_context.__toESM(require("node:path"));

//#region src/rspack/utils.ts
function encodeVirtualModuleId(id, plugin) {
	return (0, node_path.resolve)(plugin.__virtualModulePrefix, encodeURIComponent(id));
}
function decodeVirtualModuleId(encoded, _plugin) {
	return decodeURIComponent((0, node_path.basename)(encoded));
}
function isVirtualModuleId(encoded, plugin) {
	return (0, node_path.dirname)(encoded) === plugin.__virtualModulePrefix;
}
var FakeVirtualModulesPlugin = class FakeVirtualModulesPlugin {
	name = "FakeVirtualModulesPlugin";
	static counter = 0;
	constructor(plugin) {
		this.plugin = plugin;
	}
	apply(compiler) {
		FakeVirtualModulesPlugin.counter++;
		const dir = this.plugin.__virtualModulePrefix;
		if (!node_fs.default.existsSync(dir)) node_fs.default.mkdirSync(dir, { recursive: true });
		compiler.hooks.shutdown.tap(this.name, () => {
			if (--FakeVirtualModulesPlugin.counter === 0) node_fs.default.rmSync(dir, {
				recursive: true,
				force: true
			});
		});
	}
	async writeModule(file) {
		const path = encodeVirtualModuleId(file, this.plugin);
		await node_fs.default.promises.writeFile(path, "");
		return path;
	}
};

//#endregion
Object.defineProperty(exports, 'FakeVirtualModulesPlugin', {
  enumerable: true,
  get: function () {
    return FakeVirtualModulesPlugin;
  }
});
Object.defineProperty(exports, 'decodeVirtualModuleId', {
  enumerable: true,
  get: function () {
    return decodeVirtualModuleId;
  }
});
Object.defineProperty(exports, 'encodeVirtualModuleId', {
  enumerable: true,
  get: function () {
    return encodeVirtualModuleId;
  }
});
Object.defineProperty(exports, 'isVirtualModuleId', {
  enumerable: true,
  get: function () {
    return isVirtualModuleId;
  }
});