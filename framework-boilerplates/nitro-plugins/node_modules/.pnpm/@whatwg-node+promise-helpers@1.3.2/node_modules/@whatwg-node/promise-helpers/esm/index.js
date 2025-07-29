const kFakePromise = Symbol.for('@whatwg-node/promise-helpers/FakePromise');
export function isPromise(value) {
    return value?.then != null;
}
export function isActualPromise(value) {
    const maybePromise = value;
    return maybePromise && maybePromise.then && maybePromise.catch && maybePromise.finally;
}
export function handleMaybePromise(inputFactory, outputSuccessFactory, outputErrorFactory, finallyFactory) {
    let result$ = fakePromise().then(inputFactory).then(outputSuccessFactory, outputErrorFactory);
    if (finallyFactory) {
        result$ = result$.finally(finallyFactory);
    }
    return unfakePromise(result$);
}
export function fakePromise(value) {
    if (value && isActualPromise(value)) {
        return value;
    }
    if (isPromise(value)) {
        return {
            then: (resolve, reject) => fakePromise(value.then(resolve, reject)),
            catch: reject => fakePromise(value.then(res => res, reject)),
            finally: cb => fakePromise(cb ? promiseLikeFinally(value, cb) : value),
            [Symbol.toStringTag]: 'Promise',
        };
    }
    // Write a fake promise to avoid the promise constructor
    // being called with `new Promise` in the browser.
    return {
        then(resolve) {
            if (resolve) {
                try {
                    return fakePromise(resolve(value));
                }
                catch (err) {
                    return fakeRejectPromise(err);
                }
            }
            return this;
        },
        catch() {
            return this;
        },
        finally(cb) {
            if (cb) {
                try {
                    return fakePromise(cb()).then(() => value, () => value);
                }
                catch (err) {
                    return fakeRejectPromise(err);
                }
            }
            return this;
        },
        [Symbol.toStringTag]: 'Promise',
        __fakePromiseValue: value,
        [kFakePromise]: 'resolved',
    };
}
export function createDeferredPromise() {
    if (Promise.withResolvers) {
        return Promise.withResolvers();
    }
    let resolveFn;
    let rejectFn;
    const promise = new Promise(function deferredPromiseExecutor(resolve, reject) {
        resolveFn = resolve;
        rejectFn = reject;
    });
    return {
        promise,
        get resolve() {
            return resolveFn;
        },
        get reject() {
            return rejectFn;
        },
    };
}
export { iterateAsync as iterateAsyncVoid };
export function iterateAsync(iterable, callback, results) {
    if (iterable?.length === 0) {
        return;
    }
    const iterator = iterable[Symbol.iterator]();
    let index = 0;
    function iterate() {
        const { done: endOfIterator, value } = iterator.next();
        if (endOfIterator) {
            return;
        }
        let endedEarly = false;
        function endEarly() {
            endedEarly = true;
        }
        return handleMaybePromise(function handleCallback() {
            return callback(value, endEarly, index++);
        }, function handleCallbackResult(result) {
            if (result) {
                results?.push(result);
            }
            if (endedEarly) {
                return;
            }
            return iterate();
        });
    }
    return iterate();
}
export function fakeRejectPromise(error) {
    return {
        then(_resolve, reject) {
            if (reject) {
                try {
                    return fakePromise(reject(error));
                }
                catch (err) {
                    return fakeRejectPromise(err);
                }
            }
            return this;
        },
        catch(reject) {
            if (reject) {
                try {
                    return fakePromise(reject(error));
                }
                catch (err) {
                    return fakeRejectPromise(err);
                }
            }
            return this;
        },
        finally(cb) {
            if (cb) {
                try {
                    cb();
                }
                catch (err) {
                    return fakeRejectPromise(err);
                }
            }
            return this;
        },
        __fakeRejectError: error,
        [Symbol.toStringTag]: 'Promise',
        [kFakePromise]: 'rejected',
    };
}
export function mapMaybePromise(input, onSuccess, onError) {
    return handleMaybePromise(() => input, onSuccess, onError);
}
/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
export function mapAsyncIterator(iterator, onNext, onError, onEnd) {
    if (Symbol.asyncIterator in iterator) {
        iterator = iterator[Symbol.asyncIterator]();
    }
    let $return;
    let abruptClose;
    let onEndWithValue;
    if (onEnd) {
        let onEndWithValueResult /** R in onEndWithValue */;
        onEndWithValue = value => {
            onEndWithValueResult ||= handleMaybePromise(onEnd, () => value, () => value);
            return onEndWithValueResult;
        };
    }
    if (typeof iterator.return === 'function') {
        $return = iterator.return;
        abruptClose = (error) => {
            const rethrow = () => {
                throw error;
            };
            return $return.call(iterator).then(rethrow, rethrow);
        };
    }
    function mapResult(result) {
        if (result.done) {
            return onEndWithValue ? onEndWithValue(result) : result;
        }
        return handleMaybePromise(() => result.value, value => handleMaybePromise(() => onNext(value), iteratorResult, abruptClose));
    }
    let mapReject;
    if (onError) {
        let onErrorResult;
        // Capture rejectCallback to ensure it cannot be null.
        const reject = onError;
        mapReject = (error) => {
            onErrorResult ||= handleMaybePromise(() => error, error => handleMaybePromise(() => reject(error), iteratorResult, abruptClose));
            return onErrorResult;
        };
    }
    return {
        next() {
            return iterator.next().then(mapResult, mapReject);
        },
        return() {
            const res$ = $return
                ? $return.call(iterator).then(mapResult, mapReject)
                : fakePromise({ value: undefined, done: true });
            return onEndWithValue ? res$.then(onEndWithValue) : res$;
        },
        throw(error) {
            if (typeof iterator.throw === 'function') {
                return iterator.throw(error).then(mapResult, mapReject);
            }
            if (abruptClose) {
                return abruptClose(error);
            }
            return fakeRejectPromise(error);
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}
function iteratorResult(value) {
    return { value, done: false };
}
function isFakePromise(value) {
    return value?.[kFakePromise] === 'resolved';
}
function isFakeRejectPromise(value) {
    return value?.[kFakePromise] === 'rejected';
}
export function promiseLikeFinally(value, onFinally) {
    if ('finally' in value) {
        return value.finally(onFinally);
    }
    return value.then(res => {
        const finallyRes = onFinally();
        return isPromise(finallyRes) ? finallyRes.then(() => res) : res;
    }, err => {
        const finallyRes = onFinally();
        if (isPromise(finallyRes)) {
            return finallyRes.then(() => {
                throw err;
            });
        }
        else {
            throw err;
        }
    });
}
export function unfakePromise(promise) {
    if (isFakePromise(promise)) {
        return promise.__fakePromiseValue;
    }
    if (isFakeRejectPromise(promise)) {
        throw promise.__fakeRejectError;
    }
    return promise;
}
