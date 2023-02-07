import _extends from "@swc/helpers/src/_extends.mjs";
export const ACTION_BUILD_OK = 'build-ok';
export const ACTION_BUILD_ERROR = 'build-error';
export const ACTION_BEFORE_REFRESH = 'before-fast-refresh';
export const ACTION_REFRESH = 'fast-refresh';
export const ACTION_UNHANDLED_ERROR = 'unhandled-error';
export const ACTION_UNHANDLED_REJECTION = 'unhandled-rejection';
function pushErrorFilterDuplicates(errors, err) {
    return [
        ...errors.filter((e)=>{
            // Filter out duplicate errors
            return e.event.reason !== err.event.reason;
        }),
        err, 
    ];
}
export function errorOverlayReducer(state, action) {
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

//# sourceMappingURL=error-overlay-reducer.js.map