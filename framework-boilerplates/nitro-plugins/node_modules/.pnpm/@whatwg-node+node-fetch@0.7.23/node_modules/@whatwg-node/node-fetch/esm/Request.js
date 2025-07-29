import { Agent as HTTPAgent } from 'node:http';
import { Agent as HTTPSAgent } from 'node:https';
import { PonyfillBody } from './Body.js';
import { isHeadersLike, PonyfillHeaders } from './Headers.js';
import { PonyfillURL } from './URL.js';
function isRequest(input) {
    return input[Symbol.toStringTag] === 'Request';
}
function isURL(obj) {
    return obj?.href != null;
}
export class PonyfillRequest extends PonyfillBody {
    constructor(input, options) {
        let _url;
        let _parsedUrl;
        let bodyInit = null;
        let requestInit;
        if (typeof input === 'string') {
            _url = input;
        }
        else if (isURL(input)) {
            _parsedUrl = input;
        }
        else if (isRequest(input)) {
            if (input._parsedUrl) {
                _parsedUrl = input._parsedUrl;
            }
            else if (input._url) {
                _url = input._url;
            }
            else {
                _url = input.url;
            }
            bodyInit = input.body;
            requestInit = input;
        }
        if (options != null) {
            bodyInit = options.body || null;
            requestInit = options;
        }
        super(bodyInit, requestInit);
        this._url = _url;
        this._parsedUrl = _parsedUrl;
        this.cache = requestInit?.cache || 'default';
        this.credentials = requestInit?.credentials || 'same-origin';
        this.headers =
            requestInit?.headers && isHeadersLike(requestInit.headers)
                ? requestInit.headers
                : new PonyfillHeaders(requestInit?.headers);
        this.integrity = requestInit?.integrity || '';
        this.keepalive = requestInit?.keepalive != null ? requestInit?.keepalive : false;
        this.method = requestInit?.method?.toUpperCase() || 'GET';
        this.mode = requestInit?.mode || 'cors';
        this.redirect = requestInit?.redirect || 'follow';
        this.referrer = requestInit?.referrer || 'about:client';
        this.referrerPolicy = requestInit?.referrerPolicy || 'no-referrer';
        this.headersSerializer = requestInit?.headersSerializer;
        this.duplex = requestInit?.duplex || 'half';
        this.destination = 'document';
        this.priority = 'auto';
        if (this.method !== 'GET' && this.method !== 'HEAD') {
            this.handleContentLengthHeader(true);
        }
        if (requestInit?.agent != null) {
            const protocol = _parsedUrl?.protocol || _url || this.url;
            if (requestInit.agent === false) {
                this.agent = false;
            }
            else if (protocol.startsWith('http:') && requestInit.agent instanceof HTTPAgent) {
                this.agent = requestInit.agent;
            }
            else if (protocol.startsWith('https:') && requestInit.agent instanceof HTTPSAgent) {
                this.agent = requestInit.agent;
            }
        }
    }
    headersSerializer;
    cache;
    credentials;
    destination;
    headers;
    integrity;
    keepalive;
    method;
    mode;
    priority;
    redirect;
    referrer;
    referrerPolicy;
    _url;
    get signal() {
        this._signal ||= new AbortController().signal;
        return this._signal;
    }
    get url() {
        if (this._url == null) {
            if (this._parsedUrl) {
                this._url = this._parsedUrl.toString();
            }
            else {
                throw new TypeError('Invalid URL');
            }
        }
        return this._url;
    }
    _parsedUrl;
    get parsedUrl() {
        if (this._parsedUrl == null) {
            if (this._url != null) {
                this._parsedUrl = new PonyfillURL(this._url, 'http://localhost');
            }
            else {
                throw new TypeError('Invalid URL');
            }
        }
        return this._parsedUrl;
    }
    duplex;
    agent;
    clone() {
        return this;
    }
    [Symbol.toStringTag] = 'Request';
}
