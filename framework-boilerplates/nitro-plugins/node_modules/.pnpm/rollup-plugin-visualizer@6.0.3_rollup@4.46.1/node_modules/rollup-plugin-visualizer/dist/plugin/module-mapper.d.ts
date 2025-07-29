import { ModuleMeta, ModuleLengths, ModuleUID, VisualizerData } from "../shared/types";
export declare const getDataHash: (json: string) => string;
export declare const replaceHashPlaceholders: (data: VisualizerData) => string;
export declare class ModuleMapper {
    private projectRoot;
    private nodeParts;
    private nodeMetas;
    private counter;
    constructor(projectRoot: string | RegExp);
    trimProjectRootId(moduleId: string): string;
    uniqueId(): ModuleUID;
    getModuleUid(moduleId: string): ModuleUID;
    getBundleModuleUid(bundleId: string, moduleId: string): ModuleUID;
    setNodePart(bundleId: string, moduleId: string, value: ModuleLengths): ModuleUID;
    setNodeMeta(moduleId: string, value: {
        isEntry?: boolean;
        isExternal?: boolean;
    }): void;
    hasNodePart(bundleId: string, moduleId: string): boolean;
    getNodeParts(): ModuleMapper["nodeParts"];
    getNodeMetas(): Record<ModuleUID, ModuleMeta>;
    addImportedByLink(targetId: string, sourceId: string): void;
    addImportedLink(sourceId: string, targetId: string, dynamic?: boolean): void;
}
