import type nodeDomain from "node:domain";
export { Domain } from "./internal/domain/domain.mjs";
export declare const create: typeof nodeDomain.create;
export declare const createDomain: typeof nodeDomain.create;
export declare const active: unknown;
export declare const _stack: unknown;
declare const _default: typeof nodeDomain;
export default _default;
