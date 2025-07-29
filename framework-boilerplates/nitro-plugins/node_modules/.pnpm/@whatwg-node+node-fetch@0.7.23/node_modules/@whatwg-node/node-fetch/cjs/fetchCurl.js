"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCurl = fetchCurl;
const node_stream_1 = require("node:stream");
const node_tls_1 = require("node:tls");
const promise_helpers_1 = require("@whatwg-node/promise-helpers");
const Response_js_1 = require("./Response.js");
const utils_js_1 = require("./utils.js");
function fetchCurl(fetchRequest) {
    const { Curl, CurlFeature, CurlPause, CurlProgressFunc } = globalThis['libcurl'];
    const curlHandle = new Curl();
    curlHandle.enable(CurlFeature.NoDataParsing);
    curlHandle.setOpt('URL', fetchRequest.url);
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
        curlHandle.setOpt('SSL_VERIFYPEER', false);
    }
    if (process.env.NODE_EXTRA_CA_CERTS) {
        curlHandle.setOpt('CAINFO', process.env.NODE_EXTRA_CA_CERTS);
    }
    else {
        curlHandle.setOpt('CAINFO_BLOB', node_tls_1.rootCertificates.join('\n'));
    }
    curlHandle.enable(CurlFeature.StreamResponse);
    let signal;
    if (fetchRequest._signal === null) {
        signal = undefined;
    }
    else if (fetchRequest._signal) {
        signal = fetchRequest._signal;
    }
    curlHandle.setStreamProgressCallback(function () {
        return signal?.aborted ? (process.env.DEBUG ? CurlProgressFunc.Continue : 1) : 0;
    });
    if (fetchRequest['bodyType'] === 'String') {
        curlHandle.setOpt('POSTFIELDS', fetchRequest['bodyInit']);
    }
    else {
        const nodeReadable = (fetchRequest.body != null
            ? (0, utils_js_1.isNodeReadable)(fetchRequest.body)
                ? fetchRequest.body
                : node_stream_1.Readable.from(fetchRequest.body)
            : null);
        if (nodeReadable) {
            curlHandle.setOpt('UPLOAD', true);
            curlHandle.setUploadStream(nodeReadable);
        }
    }
    if (process.env.DEBUG) {
        curlHandle.setOpt('VERBOSE', true);
    }
    curlHandle.setOpt('TRANSFER_ENCODING', false);
    curlHandle.setOpt('HTTP_TRANSFER_DECODING', true);
    curlHandle.setOpt('FOLLOWLOCATION', fetchRequest.redirect === 'follow');
    curlHandle.setOpt('MAXREDIRS', 20);
    curlHandle.setOpt('ACCEPT_ENCODING', '');
    curlHandle.setOpt('CUSTOMREQUEST', fetchRequest.method);
    const headersSerializer = fetchRequest.headersSerializer || utils_js_1.defaultHeadersSerializer;
    let size;
    const curlHeaders = headersSerializer(fetchRequest.headers, value => {
        size = Number(value);
    });
    if (size != null) {
        curlHandle.setOpt('INFILESIZE', size);
    }
    curlHandle.setOpt('HTTPHEADER', curlHeaders);
    curlHandle.enable(CurlFeature.NoHeaderParsing);
    const deferredPromise = (0, promise_helpers_1.createDeferredPromise)();
    let streamResolved;
    function onAbort() {
        if (curlHandle.isOpen) {
            try {
                curlHandle.pause(CurlPause.Recv);
            }
            catch (e) {
                deferredPromise.reject(e);
            }
        }
    }
    signal?.addEventListener('abort', onAbort, { once: true });
    curlHandle.once('end', function endListener() {
        try {
            curlHandle.close();
        }
        catch (e) {
            deferredPromise.reject(e);
        }
        signal?.removeEventListener('abort', onAbort);
    });
    curlHandle.once('error', function errorListener(error) {
        if (streamResolved && !streamResolved.closed && !streamResolved.destroyed) {
            streamResolved.destroy(error);
        }
        else {
            if (error.message === 'Operation was aborted by an application callback') {
                error.message = 'The operation was aborted.';
            }
            deferredPromise.reject(error);
        }
        try {
            curlHandle.close();
        }
        catch (e) {
            deferredPromise.reject(e);
        }
    });
    curlHandle.once('stream', function streamListener(stream, status, headersBuf) {
        const outputStream = stream.pipe(new node_stream_1.PassThrough(), {
            end: true,
        });
        const headersFlat = headersBuf
            .toString('utf8')
            .split(/\r?\n|\r/g)
            .filter(headerFilter => {
            if (headerFilter && !headerFilter.startsWith('HTTP/')) {
                if (fetchRequest.redirect === 'error' &&
                    headerFilter.toLowerCase().includes('location') &&
                    (0, utils_js_1.shouldRedirect)(status)) {
                    if (!stream.destroyed) {
                        stream.resume();
                    }
                    outputStream.destroy();
                    deferredPromise.reject(new Error('redirect is not allowed'));
                }
                return true;
            }
            return false;
        });
        const headersInit = headersFlat.map(headerFlat => headerFlat.split(/:\s(.+)/).slice(0, 2));
        const ponyfillResponse = new Response_js_1.PonyfillResponse(outputStream, {
            status,
            headers: headersInit,
            url: curlHandle.getInfo(Curl.info.REDIRECT_URL)?.toString() || fetchRequest.url,
            redirected: Number(curlHandle.getInfo(Curl.info.REDIRECT_COUNT)) > 0,
        });
        deferredPromise.resolve(ponyfillResponse);
        streamResolved = outputStream;
    });
    setImmediate(() => {
        curlHandle.perform();
    });
    return deferredPromise.promise;
}
