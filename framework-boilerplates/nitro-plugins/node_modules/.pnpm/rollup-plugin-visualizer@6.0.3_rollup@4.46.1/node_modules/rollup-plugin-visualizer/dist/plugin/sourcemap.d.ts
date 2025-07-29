import { OutputChunk } from "rollup";
interface SourceMapModuleRenderInfo {
    id: string;
    renderedLength: number;
    code: string[];
}
export declare const getSourcemapModules: (id: string, outputChunk: OutputChunk, dir: string) => Promise<Record<string, SourceMapModuleRenderInfo>>;
export {};
