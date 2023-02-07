"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParseSettings = void 0;
const debug_1 = __importDefault(require("debug"));
const globby_1 = require("globby");
const is_glob_1 = __importDefault(require("is-glob"));
const shared_1 = require("../create-program/shared");
const inferSingleRun_1 = require("./inferSingleRun");
const warnAboutTSVersion_1 = require("./warnAboutTSVersion");
const log = (0, debug_1.default)('typescript-eslint:typescript-estree:parser:parseSettings:createParseSettings');
function createParseSettings(code, options = {}) {
    var _a, _b;
    const tsconfigRootDir = typeof options.tsconfigRootDir === 'string'
        ? options.tsconfigRootDir
        : process.cwd();
    const parseSettings = {
        code: enforceString(code),
        comment: options.comment === true,
        comments: [],
        createDefaultProgram: options.createDefaultProgram === true,
        debugLevel: options.debugLevel === true
            ? new Set(['typescript-eslint'])
            : Array.isArray(options.debugLevel)
                ? new Set(options.debugLevel)
                : new Set(),
        errorOnTypeScriptSyntacticAndSemanticIssues: false,
        errorOnUnknownASTType: options.errorOnUnknownASTType === true,
        EXPERIMENTAL_useSourceOfProjectReferenceRedirect: options.EXPERIMENTAL_useSourceOfProjectReferenceRedirect === true,
        extraFileExtensions: Array.isArray(options.extraFileExtensions) &&
            options.extraFileExtensions.every(ext => typeof ext === 'string')
            ? options.extraFileExtensions
            : [],
        filePath: (0, shared_1.ensureAbsolutePath)(typeof options.filePath === 'string' && options.filePath !== '<input>'
            ? options.filePath
            : getFileName(options.jsx), tsconfigRootDir),
        jsx: options.jsx === true,
        loc: options.loc === true,
        log: typeof options.loggerFn === 'function'
            ? options.loggerFn
            : options.loggerFn === false
                ? () => { }
                : console.log,
        moduleResolver: (_a = options.moduleResolver) !== null && _a !== void 0 ? _a : '',
        preserveNodeMaps: options.preserveNodeMaps !== false,
        programs: Array.isArray(options.programs) ? options.programs : null,
        projects: [],
        range: options.range === true,
        singleRun: (0, inferSingleRun_1.inferSingleRun)(options),
        tokens: options.tokens === true ? [] : null,
        tsconfigRootDir,
    };
    // debug doesn't support multiple `enable` calls, so have to do it all at once
    if (parseSettings.debugLevel.size > 0) {
        const namespaces = [];
        if (parseSettings.debugLevel.has('typescript-eslint')) {
            namespaces.push('typescript-eslint:*');
        }
        if (parseSettings.debugLevel.has('eslint') ||
            // make sure we don't turn off the eslint debug if it was enabled via --debug
            debug_1.default.enabled('eslint:*,-eslint:code-path')) {
            // https://github.com/eslint/eslint/blob/9dfc8501fb1956c90dc11e6377b4cb38a6bea65d/bin/eslint.js#L25
            namespaces.push('eslint:*,-eslint:code-path');
        }
        debug_1.default.enable(namespaces.join(','));
    }
    if (Array.isArray(options.programs)) {
        if (!options.programs.length) {
            throw new Error(`You have set parserOptions.programs to an empty array. This will cause all files to not be found in existing programs. Either provide one or more existing TypeScript Program instances in the array, or remove the parserOptions.programs setting.`);
        }
        log('parserOptions.programs was provided, so parserOptions.project will be ignored.');
    }
    // Providing a program overrides project resolution
    if (!parseSettings.programs) {
        const projectFolderIgnoreList = ((_b = options.projectFolderIgnoreList) !== null && _b !== void 0 ? _b : ['**/node_modules/**'])
            .reduce((acc, folder) => {
            if (typeof folder === 'string') {
                acc.push(folder);
            }
            return acc;
        }, [])
            // prefix with a ! for not match glob
            .map(folder => (folder.startsWith('!') ? folder : `!${folder}`));
        parseSettings.projects = prepareAndTransformProjects(tsconfigRootDir, options.project, projectFolderIgnoreList);
    }
    (0, warnAboutTSVersion_1.warnAboutTSVersion)(parseSettings);
    return parseSettings;
}
exports.createParseSettings = createParseSettings;
/**
 * Ensures source code is a string.
 */
function enforceString(code) {
    if (typeof code !== 'string') {
        return String(code);
    }
    return code;
}
/**
 * Compute the filename based on the parser options.
 *
 * Even if jsx option is set in typescript compiler, filename still has to
 * contain .tsx file extension.
 *
 * @param options Parser options
 */
function getFileName(jsx) {
    return jsx ? 'estree.tsx' : 'estree.ts';
}
function getTsconfigPath(tsconfigPath, tsconfigRootDir) {
    return (0, shared_1.getCanonicalFileName)((0, shared_1.ensureAbsolutePath)(tsconfigPath, tsconfigRootDir));
}
/**
 * Normalizes, sanitizes, resolves and filters the provided project paths
 */
function prepareAndTransformProjects(tsconfigRootDir, projectsInput, ignoreListInput) {
    const sanitizedProjects = [];
    // Normalize and sanitize the project paths
    if (typeof projectsInput === 'string') {
        sanitizedProjects.push(projectsInput);
    }
    else if (Array.isArray(projectsInput)) {
        for (const project of projectsInput) {
            if (typeof project === 'string') {
                sanitizedProjects.push(project);
            }
        }
    }
    if (sanitizedProjects.length === 0) {
        return [];
    }
    // Transform glob patterns into paths
    const nonGlobProjects = sanitizedProjects.filter(project => !(0, is_glob_1.default)(project));
    const globProjects = sanitizedProjects.filter(project => (0, is_glob_1.default)(project));
    const uniqueCanonicalProjectPaths = new Set(nonGlobProjects
        .concat((0, globby_1.sync)([...globProjects, ...ignoreListInput], {
        cwd: tsconfigRootDir,
    }))
        .map(project => getTsconfigPath(project, tsconfigRootDir)));
    log('parserOptions.project (excluding ignored) matched projects: %s', uniqueCanonicalProjectPaths);
    return Array.from(uniqueCanonicalProjectPaths);
}
//# sourceMappingURL=createParseSettings.js.map