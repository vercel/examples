export { AST, parse, parseAndGenerateServices, parseWithNodeMaps, ParseAndGenerateServicesResult, ParseWithNodeMapsResult, clearProgramCache, } from './parser';
export { ParserServices, TSESTreeOptions } from './parser-options';
export { simpleTraverse } from './simple-traverse';
export * from './ts-estree';
export { clearWatchCaches as clearCaches } from './create-program/getWatchProgramsForProjects';
export { createProgramFromConfigFile as createProgram } from './create-program/useProvidedPrograms';
export * from './create-program/getScriptKind';
export { typescriptVersionIsAtLeast } from './version-check';
export * from './getModifiers';
export { visitorKeys } from '@typescript-eslint/visitor-keys';
export declare const version: string;
//# sourceMappingURL=index.d.ts.map