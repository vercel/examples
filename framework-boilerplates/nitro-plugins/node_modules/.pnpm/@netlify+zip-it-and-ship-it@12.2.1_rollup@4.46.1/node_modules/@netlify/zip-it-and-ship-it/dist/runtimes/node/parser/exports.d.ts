import type { Statement } from '@babel/types';
import type { ISCExport } from '../in_source_config/index.js';
import type { BindingMethod } from './bindings.js';
/**
 * Traverses a list of nodes and returns:
 *
 * 1. Named `config` object export (ESM or CJS)
 * 2. Whether there is a default export (ESM or CJS)
 * 3. Named `handler` function exports (ESM or CJS)
 * 4. The module format syntax used in the file: if any `import` or `export`
 *    declarations are found, this is ESM; if not, this is CJS
 */
export declare const traverseNodes: (nodes: Statement[], getAllBindings: BindingMethod) => {
    configExport: Record<string, unknown>;
    handlerExports: ISCExport[];
    hasDefaultExport: boolean;
    inputModuleFormat: "cjs";
};
