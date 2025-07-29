'use strict';
/*
 * Simplified mute module.
 * https://github.com/shannonmoeller/mute
 *
 * The MIT License (MIT)
 *
 * Copyright (c) Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
var concat = Array.prototype.concat;
function mute(stream) {
    var write = stream && stream.write;
    var originalWrite = write && write.originalWrite;
    // We only need to mute unmuted streams
    if (!write || originalWrite) {
        return;
    }
    function noop() { }
    noop.originalWrite = write;
    stream.write = noop;
}
function unmute(stream) {
    var write = stream && stream.write;
    var originalWrite = write && write.originalWrite;
    // We only need to unmute muted streams
    if (!write || !originalWrite) {
        return;
    }
    stream.write = originalWrite;
}
module.exports = function () {
    var streams = [process.stdout, process.stderr];
    streams.forEach(mute);
    return function unmuteStreams() {
        streams.forEach(unmute);
    };
};
