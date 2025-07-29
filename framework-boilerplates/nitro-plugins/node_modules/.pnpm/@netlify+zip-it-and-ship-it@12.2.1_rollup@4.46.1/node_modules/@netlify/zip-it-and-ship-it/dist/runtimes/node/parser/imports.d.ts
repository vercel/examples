import type { Statement } from '@babel/types';
export declare const getImports: (node: Statement, importPath: string) => {
    imported: string;
    local: string;
}[];
