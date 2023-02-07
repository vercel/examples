"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.errorOverlayReducer = errorOverlayReducer;
exports.ACTION_UNHANDLED_REJECTION = exports.ACTION_UNHANDLED_ERROR = exports.ACTION_REFRESH = exports.ACTION_BEFORE_REFRESH = exports.ACTION_BUILD_ERROR = exports.ACTION_BUILD_OK = void 0;
var _extends = require("@swc/helpers/lib/_extends.js").default;
const ACTION_BUILD_OK = 'build-ok';
exports.ACTION_BUILD_OK = ACTION_BUILD_OK;
const ACTION_BUILD_ERROR = 'build-error';
exports.ACTION_BUILD_ERROR = ACTION_BUILD_ERROR;
const ACTION_BEFORE_REFRESH = 'before-fast-refresh';
exports.ACTION_BEFORE_REFRESH = ACTION_BEFORE_REFRESH;
const ACTION_REFRESH = 'fast-refresh';
exports.ACTION_REFRESH = ACTION_REFRESH;
const ACTION_UNHANDLED_ERROR = 'unhandled-error';
exports.ACTION_UNHANDLED_ERROR = ACTION_UNHANDLED_ERROR;
const ACTION_UNHANDLED_REJECTION = 'unhandled-rejection';
exports.ACTION_UNHANDLED_REJECTION = ACTION_UNHANDLED_REJECTION;
function pushErrorFilterDuplicates(errors, err) {
    return [
        ...errors.filter((e)=>{
            // Filter out duplicate errors
            return e.event.reason !== err.event.reason;
        }),
        err, 
    ];
}
function errorOverlayReducer(state, action) {
    switch(action.type){
        case ACTION_BUILD_OK:
            {
                return _extends({}, state, {
                    buildError: null
                });
            }
        case ACTION_BUILD_ERROR:
            {
                return _extends({}, state, {
                    buildError: action.message
                });
            }
        case ACTION_BEFORE_REFRESH:
            {
                return _extends({}, state, {
                    refreshState: {
                        type: 'pending',
                        errors: []
                    }
                });
            }
        case ACTION_REFRESH:
            {
                return _extends({}, state, {
                    buildError: null,
                    errors: // Errors can come in during updates. In this case, UNHANDLED_ERROR
                    // and UNHANDLED_REJECTION events might be dispatched between the
                    // BEFORE_REFRESH and the REFRESH event. We want to keep those errors
                    // around until the next refresh. Otherwise we run into a race
                    // condition where those errors would be cleared on refresh completion
                    // before they can be displayed.
                    state.refreshState.type === 'pending' ? state.refreshState.errors : [],
                    refreshState: {
                        type: 'idle'
                    }
                });
            }
        case ACTION_UNHANDLED_ERROR:
        case ACTION_UNHANDLED_REJECTION:
            {
                switch(state.refreshState.type){
                    case 'idle':
                        {
                            return _extends({}, state, {
                                nextId: state.nextId + 1,
                                errors: pushErrorFilterDuplicates(state.errors, {
                                    id: state.nextId,
                                    event: action
                                })
                            });
                        }
                    case 'pending':
                        {
                            return _extends({}, state, {
                                nextId: state.nextId + 1,
                                refreshState: _extends({}, state.refreshState, {
                                    errors: pushErrorFilterDuplicates(state.refreshState.errors, {
                                        id: state.nextId,
                                        event: action
                                    })
                                })
                            });
                        }
                    default:
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const _ = state.refreshState;
                        return state;
                }
            }
        default:
            {
                return state;
            }
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=error-overlay-reducer.js.map