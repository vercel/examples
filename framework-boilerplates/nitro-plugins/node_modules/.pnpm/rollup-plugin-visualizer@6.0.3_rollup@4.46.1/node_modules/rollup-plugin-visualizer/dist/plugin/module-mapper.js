"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleMapper = exports.replaceHashPlaceholders = exports.getDataHash = void 0;
const crypto = __importStar(require("crypto"));
const HASH_PLACEHOLDER = "!{ROLLUP_VISUALIZER_HASH_PLACEHOLDER}";
const HASH_PLACEHOLDER_REGEXP = new RegExp(`"${HASH_PLACEHOLDER}-(\\d+)"`, "g");
const getDataHash = (json) => {
    const hash = crypto.createHash("sha1").update(json).digest("hex");
    const hashSub = hash.substring(0, 8);
    return hashSub;
};
exports.getDataHash = getDataHash;
const replaceHashPlaceholders = (data) => {
    const json = JSON.stringify(data);
    const hash = (0, exports.getDataHash)(json);
    const jsonWithHash = json.replace(HASH_PLACEHOLDER_REGEXP, (_, num) => `"${hash}-${num}"`);
    return jsonWithHash;
};
exports.replaceHashPlaceholders = replaceHashPlaceholders;
class ModuleMapper {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.nodeParts = {};
        this.nodeMetas = {};
        this.counter = 0;
    }
    trimProjectRootId(moduleId) {
        if (typeof this.projectRoot === "string" && moduleId.startsWith(this.projectRoot)) {
            return moduleId.slice(this.projectRoot.length);
        }
        return moduleId.replace(this.projectRoot, "");
    }
    uniqueId() {
        return `${HASH_PLACEHOLDER}-${this.counter++}`;
    }
    getModuleUid(moduleId) {
        if (!(moduleId in this.nodeMetas)) {
            this.nodeMetas[moduleId] = {
                uid: this.uniqueId(),
                meta: {
                    id: this.trimProjectRootId(moduleId),
                    moduleParts: {},
                    imported: new Set(),
                    importedBy: new Set(),
                },
            };
        }
        return this.nodeMetas[moduleId].uid;
    }
    getBundleModuleUid(bundleId, moduleId) {
        if (!(moduleId in this.nodeMetas)) {
            this.nodeMetas[moduleId] = {
                uid: this.uniqueId(),
                meta: {
                    id: this.trimProjectRootId(moduleId),
                    moduleParts: {},
                    imported: new Set(),
                    importedBy: new Set(),
                },
            };
        }
        if (!(bundleId in this.nodeMetas[moduleId].meta.moduleParts)) {
            this.nodeMetas[moduleId].meta.moduleParts[bundleId] = this.uniqueId();
        }
        return this.nodeMetas[moduleId].meta.moduleParts[bundleId];
    }
    setNodePart(bundleId, moduleId, value) {
        const uid = this.getBundleModuleUid(bundleId, moduleId);
        if (uid in this.nodeParts) {
            throw new Error(`Override module: bundle id ${bundleId}, module id ${moduleId}, value ${JSON.stringify(value)}, existing value: ${JSON.stringify(this.nodeParts[uid])}`);
        }
        this.nodeParts[uid] = { ...value, metaUid: this.getModuleUid(moduleId) };
        return uid;
    }
    setNodeMeta(moduleId, value) {
        this.getModuleUid(moduleId);
        this.nodeMetas[moduleId].meta.isEntry = value.isEntry;
        this.nodeMetas[moduleId].meta.isExternal = value.isExternal;
    }
    hasNodePart(bundleId, moduleId) {
        if (!(moduleId in this.nodeMetas)) {
            return false;
        }
        if (!(bundleId in this.nodeMetas[moduleId].meta.moduleParts)) {
            return false;
        }
        if (!(this.nodeMetas[moduleId].meta.moduleParts[bundleId] in this.nodeParts)) {
            return false;
        }
        return true;
    }
    getNodeParts() {
        return this.nodeParts;
    }
    getNodeMetas() {
        const nodeMetas = {};
        for (const { uid, meta } of Object.values(this.nodeMetas)) {
            nodeMetas[uid] = {
                ...meta,
                imported: [...meta.imported].map((rawImport) => {
                    const [uid, dynamic] = rawImport.split(",");
                    const importData = { uid };
                    if (dynamic === "true") {
                        importData.dynamic = true;
                    }
                    return importData;
                }),
                importedBy: [...meta.importedBy].map((rawImport) => {
                    const [uid, dynamic] = rawImport.split(",");
                    const importData = { uid };
                    if (dynamic === "true") {
                        importData.dynamic = true;
                    }
                    return importData;
                }),
            };
        }
        return nodeMetas;
    }
    addImportedByLink(targetId, sourceId) {
        const sourceUid = this.getModuleUid(sourceId);
        this.getModuleUid(targetId);
        this.nodeMetas[targetId].meta.importedBy.add(sourceUid);
    }
    addImportedLink(sourceId, targetId, dynamic = false) {
        const targetUid = this.getModuleUid(targetId);
        this.getModuleUid(sourceId);
        this.nodeMetas[sourceId].meta.imported.add(String([targetUid, dynamic]));
    }
}
exports.ModuleMapper = ModuleMapper;
