import noop from "../mock/noop.mjs";
import { notImplemented, notImplementedAsync, notImplementedClass } from "../_internal/utils.mjs";
import promises from "node:dns/promises";
export { promises };
export const Resolver = /* @__PURE__ */ notImplementedClass("dns.Resolver");
export const getDefaultResultOrder = () => "verbatim";
export const getServers = () => [];
export const lookup = /* @__PURE__ */ notImplementedAsync("dns.lookup");
export const lookupService = /* @__PURE__ */ notImplementedAsync("dns.lookupService");
export const resolve = /* @__PURE__ */ notImplementedAsync("dns.resolve");
export const resolve4 = /* @__PURE__ */ notImplementedAsync("dns.resolve4");
export const resolve6 = /* @__PURE__ */ notImplementedAsync("dns.resolve6");
export const resolveAny = /* @__PURE__ */ notImplementedAsync("dns.resolveAny");
export const resolveCaa = /* @__PURE__ */ notImplementedAsync("dns.resolveCaa");
export const resolveCname = /* @__PURE__ */ notImplementedAsync("dns.resolveCname");
export const resolveMx = /* @__PURE__ */ notImplementedAsync("dns.resolveMx");
export const resolveNaptr = /* @__PURE__ */ notImplementedAsync("dns.resolveNaptr");
export const resolveNs = /* @__PURE__ */ notImplementedAsync("dns.resolveNs");
export const resolvePtr = /* @__PURE__ */ notImplementedAsync("dns.resolvePtr");
export const resolveSoa = /* @__PURE__ */ notImplementedAsync("dns.resolveSoa");
export const resolveSrv = /* @__PURE__ */ notImplementedAsync("dns.resolveSrv");
export const resolveTxt = /* @__PURE__ */ notImplementedAsync("dns.resolveTxt");
export const reverse = /* @__PURE__ */ notImplemented("dns.reverse");
export const setDefaultResultOrder = noop;
export const setServers = noop;
// prettier-ignore
import { NODATA, FORMERR, SERVFAIL, NOTFOUND, NOTIMP, REFUSED, BADQUERY, BADNAME, BADFAMILY, BADRESP, CONNREFUSED, TIMEOUT, EOF, FILE, NOMEM, DESTRUCTION, BADSTR, BADFLAGS, NONAME, BADHINTS, NOTINITIALIZED, LOADIPHLPAPI, ADDRGETNETWORKPARAMS, CANCELLED, ADDRCONFIG, ALL, V4MAPPED } from "./internal/dns/constants.mjs";
// prettier-ignore
export { NODATA, FORMERR, SERVFAIL, NOTFOUND, NOTIMP, REFUSED, BADQUERY, BADNAME, BADFAMILY, BADRESP, CONNREFUSED, TIMEOUT, EOF, FILE, NOMEM, DESTRUCTION, BADSTR, BADFLAGS, NONAME, BADHINTS, NOTINITIALIZED, LOADIPHLPAPI, ADDRGETNETWORKPARAMS, CANCELLED, ADDRCONFIG, ALL, V4MAPPED } from "./internal/dns/constants.mjs";
// prettier-ignore
export default {
	NODATA,
	FORMERR,
	SERVFAIL,
	NOTFOUND,
	NOTIMP,
	REFUSED,
	BADQUERY,
	BADNAME,
	BADFAMILY,
	BADRESP,
	CONNREFUSED,
	TIMEOUT,
	EOF,
	FILE,
	NOMEM,
	DESTRUCTION,
	BADSTR,
	BADFLAGS,
	NONAME,
	BADHINTS,
	NOTINITIALIZED,
	LOADIPHLPAPI,
	ADDRGETNETWORKPARAMS,
	CANCELLED,
	ADDRCONFIG,
	ALL,
	V4MAPPED,
	Resolver,
	getDefaultResultOrder,
	getServers,
	lookup,
	lookupService,
	promises,
	resolve,
	resolve4,
	resolve6,
	resolveAny,
	resolveCaa,
	resolveCname,
	resolveMx,
	resolveNaptr,
	resolveNs,
	resolvePtr,
	resolveSoa,
	resolveSrv,
	resolveTxt,
	reverse,
	setDefaultResultOrder,
	setServers
};
