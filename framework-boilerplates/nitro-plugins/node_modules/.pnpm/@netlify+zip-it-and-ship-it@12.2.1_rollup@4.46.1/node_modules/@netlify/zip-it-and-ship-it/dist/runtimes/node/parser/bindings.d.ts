import type { Declaration, Expression, Statement } from '@babel/types';
type Bindings = Map<string, Expression | Declaration>;
export type BindingMethod = () => Bindings;
export declare const createBindingsMethod: (nodes: Statement[]) => BindingMethod;
export {};
