// Source: https://github.com/nodejs/node/blob/v22.7.0/lib/url.js
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
import type nodeUrl from "node:url";
import * as querystring from "node:querystring";
import { fileURLToPath, urlToHttpOptions } from "./internal/url/url.mjs";
declare class Url implements nodeUrl.Url {
	auth: string | null;
	hash: string | null;
	host: string | null;
	hostname: string | null;
	href: string;
	path: string | null;
	pathname: string | null;
	protocol: string | null;
	search: string | null;
	slashes: boolean | null;
	port: string | null;
	query: string | querystring.ParsedUrlQuery | null;
	parse(url: string, parseQueryString?: boolean, slashesDenoteHost?: boolean);
	format();
	resolve(relative: string);
	resolveObject(relative: nodeUrl.Url);
	parseHost();
}
declare function urlParse(url: string | Url, parseQueryString?: boolean, slashesDenoteHost?: boolean): Url;
// Format a parsed object into a url string
declare function urlFormat(urlObject: string | Url, options: nodeUrl.URLFormatOptions);
declare function urlResolve(source: string, relative: string);
declare function urlResolveObject(source: string, relative: nodeUrl.Url);
// When used internally, we are not obligated to associate TypeError with
// this function, so non-strings can be rejected by underlying implementation.
// Public API has to validate input and throw appropriate error.
declare function pathToFileURL(path: string, options?: {
	windows?: boolean;
});
declare const URL: unknown;
declare const URLSearchParams: unknown;
declare const domainToASCII: unknown;
declare const domainToUnicode: unknown;
export { Url, urlParse as parse, urlResolve as resolve, urlResolveObject as resolveObject, urlFormat as format, URL, URLSearchParams, domainToASCII, domainToUnicode, pathToFileURL, fileURLToPath, urlToHttpOptions };
declare const _default: {};
export default _default;
