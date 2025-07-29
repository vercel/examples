import { Buffer } from 'node:buffer';
import { createReadStream, promises as fsPromises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { fetchCurl } from './fetchCurl.js';
import { fetchNodeHttp } from './fetchNodeHttp.js';
import { PonyfillRequest } from './Request.js';
import { PonyfillResponse } from './Response.js';
import { PonyfillURL } from './URL.js';
import { fakePromise } from './utils.js';
const BASE64_SUFFIX = ';base64';
async function getResponseForFile(url) {
    const path = fileURLToPath(url);
    try {
        await fsPromises.access(path, fsPromises.constants.R_OK);
        const stats = await fsPromises.stat(path, {
            bigint: true,
        });
        const readable = createReadStream(path);
        return new PonyfillResponse(readable, {
            status: 200,
            statusText: 'OK',
            headers: {
                'content-type': 'application/octet-stream',
                'last-modified': stats.mtime.toUTCString(),
            },
        });
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return new PonyfillResponse(null, {
                status: 404,
                statusText: 'Not Found',
            });
        }
        else if (err.code === 'EACCES') {
            return new PonyfillResponse(null, {
                status: 403,
                statusText: 'Forbidden',
            });
        }
        throw err;
    }
}
function getResponseForDataUri(url) {
    const [mimeType = 'text/plain', ...datas] = url.substring(5).split(',');
    const data = decodeURIComponent(datas.join(','));
    if (mimeType.endsWith(BASE64_SUFFIX)) {
        const buffer = Buffer.from(data, 'base64url');
        const realMimeType = mimeType.slice(0, -BASE64_SUFFIX.length);
        return new PonyfillResponse(buffer, {
            status: 200,
            statusText: 'OK',
            headers: {
                'content-type': realMimeType,
            },
        });
    }
    return new PonyfillResponse(data, {
        status: 200,
        statusText: 'OK',
        headers: {
            'content-type': mimeType,
        },
    });
}
function getResponseForBlob(url) {
    const blob = PonyfillURL.getBlobFromURL(url);
    if (!blob) {
        throw new TypeError('Invalid Blob URL');
    }
    return new PonyfillResponse(blob, {
        status: 200,
        headers: {
            'content-type': blob.type,
            'content-length': blob.size.toString(),
        },
    });
}
function isURL(obj) {
    return obj != null && obj.href != null;
}
export function fetchPonyfill(info, init) {
    if (typeof info === 'string' || isURL(info)) {
        const ponyfillRequest = new PonyfillRequest(info, init);
        return fetchPonyfill(ponyfillRequest);
    }
    const fetchRequest = info;
    if (fetchRequest.url.startsWith('data:')) {
        const response = getResponseForDataUri(fetchRequest.url);
        return fakePromise(response);
    }
    if (fetchRequest.url.startsWith('file:')) {
        const response = getResponseForFile(fetchRequest.url);
        return response;
    }
    if (fetchRequest.url.startsWith('blob:')) {
        const response = getResponseForBlob(fetchRequest.url);
        return fakePromise(response);
    }
    if (globalThis.libcurl && !fetchRequest.agent) {
        return fetchCurl(fetchRequest);
    }
    return fetchNodeHttp(fetchRequest);
}
