import type { AssignmentExpression, Expression, ExpressionStatement, ImportDeclaration, Statement } from '@babel/types';
export declare const isESMImportExport: (node: Statement) => node is import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | ImportDeclaration;
export declare const isImport: (node: Statement, importPath: string) => node is ImportDeclaration;
export declare const isModuleExports: (node: Statement, dotExpression?: string[]) => node is ExpressionStatement & {
    expression: AssignmentExpression;
};
export declare const isRequire: (node: Expression | undefined | null, requirePath: string) => boolean;
