import type nodeDns from "node:dns";
import promises from "node:dns/promises";
export { promises };
export declare const Resolver: typeof nodeDns.Resolver;
export declare const getDefaultResultOrder: typeof nodeDns.getDefaultResultOrder;
export declare const getServers: typeof nodeDns.getServers;
export declare const lookup: typeof nodeDns.lookup;
export declare const lookupService: typeof nodeDns.lookupService;
export declare const resolve: typeof nodeDns.resolve;
export declare const resolve4: typeof nodeDns.resolve4;
export declare const resolve6: typeof nodeDns.resolve6;
export declare const resolveAny: typeof nodeDns.resolveAny;
export declare const resolveCaa: typeof nodeDns.resolveCaa;
export declare const resolveCname: typeof nodeDns.resolveCname;
export declare const resolveMx: typeof nodeDns.resolveMx;
export declare const resolveNaptr: typeof nodeDns.resolveNaptr;
export declare const resolveNs: typeof nodeDns.resolveNs;
export declare const resolvePtr: typeof nodeDns.resolvePtr;
export declare const resolveSoa: typeof nodeDns.resolveSoa;
export declare const resolveSrv: typeof nodeDns.resolveSrv;
export declare const resolveTxt: typeof nodeDns.resolveTxt;
export declare const reverse: typeof nodeDns.reverse;
export declare const setDefaultResultOrder: typeof nodeDns.setDefaultResultOrder;
export declare const setServers: typeof nodeDns.setServers;
// prettier-ignore
export { NODATA, FORMERR, SERVFAIL, NOTFOUND, NOTIMP, REFUSED, BADQUERY, BADNAME, BADFAMILY, BADRESP, CONNREFUSED, TIMEOUT, EOF, FILE, NOMEM, DESTRUCTION, BADSTR, BADFLAGS, NONAME, BADHINTS, NOTINITIALIZED, LOADIPHLPAPI, ADDRGETNETWORKPARAMS, CANCELLED, ADDRCONFIG, ALL, V4MAPPED } from "./internal/dns/constants.mjs";
// prettier-ignore
declare const _default: {};
export default _default;
