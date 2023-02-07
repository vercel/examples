export function traverseModules(compilation, callback) {
    compilation.chunkGroups.forEach((chunkGroup)=>{
        chunkGroup.chunks.forEach((chunk)=>{
            const chunkModules = compilation.chunkGraph.getChunkModulesIterable(chunk);
            for (const mod of chunkModules){
                const modId = compilation.chunkGraph.getModuleId(mod);
                callback(mod, chunk, chunkGroup, modId);
                const anyModule = mod;
                if (anyModule.modules) {
                    for (const subMod of anyModule.modules)callback(subMod, chunk, chunkGroup, modId);
                }
            }
        });
    });
}

//# sourceMappingURL=utils.js.map