import { fakePromise } from '@whatwg-node/promise-helpers';
export function isUWSResponse(res) {
    return !!res.onData;
}
export function getRequestFromUWSRequest({ req, res, fetchAPI, controller, }) {
    const method = req.getMethod();
    let duplex;
    const chunks = [];
    const pushFns = [
        (chunk) => {
            chunks.push(chunk);
        },
    ];
    const push = (chunk) => {
        for (const pushFn of pushFns) {
            pushFn(chunk);
        }
    };
    let stopped = false;
    const stopFns = [
        () => {
            stopped = true;
        },
    ];
    const stop = () => {
        for (const stopFn of stopFns) {
            stopFn();
        }
    };
    res.onData(function (ab, isLast) {
        push(Buffer.from(Buffer.from(ab, 0, ab.byteLength)));
        if (isLast) {
            stop();
        }
    });
    let getReadableStream;
    if (method !== 'get' && method !== 'head') {
        duplex = 'half';
        controller.signal.addEventListener('abort', () => {
            stop();
        }, { once: true });
        let readableStream;
        getReadableStream = () => {
            if (!readableStream) {
                readableStream = new fetchAPI.ReadableStream({
                    start(controller) {
                        for (const chunk of chunks) {
                            controller.enqueue(chunk);
                        }
                        if (stopped) {
                            controller.close();
                            return;
                        }
                        pushFns.push((chunk) => {
                            controller.enqueue(chunk);
                        });
                        stopFns.push(() => {
                            if (controller.desiredSize) {
                                controller.close();
                            }
                        });
                    },
                });
            }
            return readableStream;
        };
    }
    const headers = new fetchAPI.Headers();
    req.forEach((key, value) => {
        headers.append(key, value);
    });
    let url = `http://localhost${req.getUrl()}`;
    const query = req.getQuery();
    if (query) {
        url += `?${query}`;
    }
    let buffer;
    function getBody() {
        if (!getReadableStream) {
            return null;
        }
        if (stopped) {
            return getBufferFromChunks();
        }
        return getReadableStream();
    }
    const request = new fetchAPI.Request(url, {
        method,
        headers,
        get body() {
            return getBody();
        },
        signal: controller.signal,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - not in the TS types yet
        duplex,
    });
    function getBufferFromChunks() {
        if (!buffer) {
            buffer = chunks.length === 1 ? chunks[0] : Buffer.concat(chunks);
        }
        return buffer;
    }
    function collectBuffer() {
        if (stopped) {
            return fakePromise(getBufferFromChunks());
        }
        return new Promise((resolve, reject) => {
            try {
                stopFns.push(() => {
                    resolve(getBufferFromChunks());
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    Object.defineProperties(request, {
        body: {
            get() {
                return getBody();
            },
            configurable: true,
            enumerable: true,
        },
        json: {
            value() {
                return collectBuffer()
                    .then(b => b.toString('utf8'))
                    .then(t => JSON.parse(t));
            },
            configurable: true,
            enumerable: true,
        },
        text: {
            value() {
                return collectBuffer().then(b => b.toString('utf8'));
            },
            configurable: true,
            enumerable: true,
        },
        arrayBuffer: {
            value() {
                return collectBuffer();
            },
            configurable: true,
            enumerable: true,
        },
    });
    return request;
}
export function createWritableFromUWS(uwsResponse, fetchAPI) {
    return new fetchAPI.WritableStream({
        write(chunk) {
            uwsResponse.cork(() => {
                uwsResponse.write(chunk);
            });
        },
        close() {
            uwsResponse.cork(() => {
                uwsResponse.end();
            });
        },
    });
}
export function sendResponseToUwsOpts(uwsResponse, fetchResponse, controller, fetchAPI) {
    if (!fetchResponse) {
        uwsResponse.writeStatus('404 Not Found');
        uwsResponse.end();
        return;
    }
    const bufferOfRes = fetchResponse._buffer;
    if (controller.signal.aborted) {
        return;
    }
    uwsResponse.cork(() => {
        uwsResponse.writeStatus(`${fetchResponse.status} ${fetchResponse.statusText}`);
        for (const [key, value] of fetchResponse.headers) {
            // content-length causes an error with Node.js's fetch
            if (key !== 'content-length') {
                if (key === 'set-cookie') {
                    const setCookies = fetchResponse.headers.getSetCookie?.();
                    if (setCookies) {
                        for (const setCookie of setCookies) {
                            uwsResponse.writeHeader(key, setCookie);
                        }
                        continue;
                    }
                }
                uwsResponse.writeHeader(key, value);
            }
        }
        if (bufferOfRes) {
            uwsResponse.end(bufferOfRes);
        }
        else if (!fetchResponse.body) {
            uwsResponse.end();
        }
    });
    if (bufferOfRes || !fetchResponse.body) {
        return;
    }
    controller.signal.addEventListener('abort', () => {
        if (!fetchResponse.body?.locked) {
            fetchResponse.body?.cancel(controller.signal.reason);
        }
    }, { once: true });
    return fetchResponse.body
        .pipeTo(createWritableFromUWS(uwsResponse, fetchAPI), {
        signal: controller.signal,
    })
        .catch(err => {
        if (controller.signal.aborted) {
            return;
        }
        throw err;
    });
}
export { fakePromise };
