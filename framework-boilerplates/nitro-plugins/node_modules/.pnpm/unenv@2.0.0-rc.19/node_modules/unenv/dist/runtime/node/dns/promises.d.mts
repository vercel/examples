import type nodeDnsPromises from "node:dns/promises";
// prettier-ignore
export { NODATA, FORMERR, SERVFAIL, NOTFOUND, NOTIMP, REFUSED, BADQUERY, BADNAME, BADFAMILY, BADRESP, CONNREFUSED, TIMEOUT, EOF, FILE, NOMEM, DESTRUCTION, BADSTR, BADFLAGS, NONAME, BADHINTS, NOTINITIALIZED, LOADIPHLPAPI, ADDRGETNETWORKPARAMS, CANCELLED } from "../internal/dns/constants.mjs";
export declare const Resolver: typeof nodeDnsPromises.Resolver;
export declare const getDefaultResultOrder: typeof nodeDnsPromises.getDefaultResultOrder;
export declare const getServers: typeof nodeDnsPromises.getServers;
export declare const lookup: typeof nodeDnsPromises.lookup;
export declare const lookupService: typeof nodeDnsPromises.lookupService;
export declare const resolve: typeof nodeDnsPromises.resolve;
export declare const resolve4: typeof nodeDnsPromises.resolve4;
export declare const resolve6: typeof nodeDnsPromises.resolve6;
export declare const resolveAny: typeof nodeDnsPromises.resolveAny;
export declare const resolveCaa: typeof nodeDnsPromises.resolveCaa;
export declare const resolveCname: typeof nodeDnsPromises.resolveCname;
export declare const resolveMx: typeof nodeDnsPromises.resolveMx;
export declare const resolveNaptr: typeof nodeDnsPromises.resolveNaptr;
export declare const resolveNs: typeof nodeDnsPromises.resolveNs;
export declare const resolvePtr: typeof nodeDnsPromises.resolvePtr;
export declare const resolveSoa: typeof nodeDnsPromises.resolveSoa;
export declare const resolveSrv: typeof nodeDnsPromises.resolveSrv;
export declare const resolveTxt: typeof nodeDnsPromises.resolveTxt;
export declare const reverse: typeof nodeDnsPromises.reverse;
export declare const setDefaultResultOrder: typeof nodeDnsPromises.setDefaultResultOrder;
export declare const setServers: typeof nodeDnsPromises.setServers;
// prettier-ignore
declare const _default: {};
export default _default;
