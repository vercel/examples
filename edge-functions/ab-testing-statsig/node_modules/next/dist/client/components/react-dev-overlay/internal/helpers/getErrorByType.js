"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getErrorByType = getErrorByType;
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _errorOverlayReducer = require("../error-overlay-reducer");
var _nodeStackFrames = require("./nodeStackFrames");
var _stackFrame = require("./stack-frame");
function getErrorByType(ev) {
    return _getErrorByType.apply(this, arguments);
}
function _getErrorByType() {
    _getErrorByType = _async_to_generator(function*(ev) {
        const { id , event  } = ev;
        switch(event.type){
            case _errorOverlayReducer.ACTION_UNHANDLED_ERROR:
            case _errorOverlayReducer.ACTION_UNHANDLED_REJECTION:
                {
                    return {
                        id,
                        runtime: true,
                        error: event.reason,
                        frames: yield (0, _stackFrame).getOriginalStackFrames(event.frames, (0, _nodeStackFrames).getErrorSource(event.reason), event.reason.toString())
                    };
                }
            default:
                {
                    break;
                }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = event;
        throw new Error('type system invariant violation');
    });
    return _getErrorByType.apply(this, arguments);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=getErrorByType.js.map