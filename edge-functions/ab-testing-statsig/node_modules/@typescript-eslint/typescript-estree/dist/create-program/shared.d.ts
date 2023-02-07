import type { Program } from 'typescript';
import * as ts from 'typescript';
import type { ModuleResolver } from '../parser-options';
import type { ParseSettings } from '../parseSettings';
interface ASTAndProgram {
    ast: ts.SourceFile;
    program: ts.Program;
}
/**
 * Compiler options required to avoid critical functionality issues
 */
declare const CORE_COMPILER_OPTIONS: ts.CompilerOptions;
declare function createDefaultCompilerOptionsFromExtra(parseSettings: ParseSettings): ts.CompilerOptions;
type CanonicalPath = string & {
    __brand: unknown;
};
declare function getCanonicalFileName(filePath: string): CanonicalPath;
declare function ensureAbsolutePath(p: string, tsconfigRootDir: string): string;
declare function canonicalDirname(p: CanonicalPath): CanonicalPath;
declare function getAstFromProgram(currentProgram: Program, parseSettings: ParseSettings): ASTAndProgram | undefined;
declare function getModuleResolver(moduleResolverPath: string): ModuleResolver;
export { ASTAndProgram, CORE_COMPILER_OPTIONS, canonicalDirname, CanonicalPath, createDefaultCompilerOptionsFromExtra, ensureAbsolutePath, getCanonicalFileName, getAstFromProgram, getModuleResolver, };
//# sourceMappingURL=shared.d.ts.map