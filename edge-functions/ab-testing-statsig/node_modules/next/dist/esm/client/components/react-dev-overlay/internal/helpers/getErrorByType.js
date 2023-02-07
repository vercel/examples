import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import { ACTION_UNHANDLED_ERROR, ACTION_UNHANDLED_REJECTION } from '../error-overlay-reducer';
import { getErrorSource } from './nodeStackFrames';
import { getOriginalStackFrames } from './stack-frame';
export function getErrorByType(ev) {
    return _getErrorByType.apply(this, arguments);
}
function _getErrorByType() {
    _getErrorByType = _async_to_generator(function*(ev) {
        const { id , event  } = ev;
        switch(event.type){
            case ACTION_UNHANDLED_ERROR:
            case ACTION_UNHANDLED_REJECTION:
                {
                    return {
                        id,
                        runtime: true,
                        error: event.reason,
                        frames: yield getOriginalStackFrames(event.frames, getErrorSource(event.reason), event.reason.toString())
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

//# sourceMappingURL=getErrorByType.js.map