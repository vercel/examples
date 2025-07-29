import type { Program } from '@babel/types';
export declare const parseExpression: ({ basePath, expression: rawExpression, resolveDir, }: {
    basePath: string;
    expression: string;
    resolveDir: string;
}) => {
    includedPathsGlob: string | null | undefined;
    type: string;
} | undefined;
export declare const safelyParseSource: (source: string) => Program | null;
export declare const safelyReadSource: (path: string) => Promise<string | null>;
