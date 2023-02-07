import type { StackFrame } from 'next/dist/compiled/stacktrace-parser';
import { SupportedErrorEvent } from './container/Errors';
export declare const ACTION_BUILD_OK = "build-ok";
export declare const ACTION_BUILD_ERROR = "build-error";
export declare const ACTION_BEFORE_REFRESH = "before-fast-refresh";
export declare const ACTION_REFRESH = "fast-refresh";
export declare const ACTION_UNHANDLED_ERROR = "unhandled-error";
export declare const ACTION_UNHANDLED_REJECTION = "unhandled-rejection";
interface BuildOkAction {
    type: typeof ACTION_BUILD_OK;
}
interface BuildErrorAction {
    type: typeof ACTION_BUILD_ERROR;
    message: string;
}
interface BeforeFastRefreshAction {
    type: typeof ACTION_BEFORE_REFRESH;
}
interface FastRefreshAction {
    type: typeof ACTION_REFRESH;
}
export interface UnhandledErrorAction {
    type: typeof ACTION_UNHANDLED_ERROR;
    reason: Error;
    frames: StackFrame[];
}
export interface UnhandledRejectionAction {
    type: typeof ACTION_UNHANDLED_REJECTION;
    reason: Error;
    frames: StackFrame[];
}
export declare type FastRefreshState = {
    type: 'idle';
} | {
    type: 'pending';
    errors: SupportedErrorEvent[];
};
export interface OverlayState {
    nextId: number;
    buildError: string | null;
    errors: SupportedErrorEvent[];
    rootLayoutMissingTagsError?: {
        missingTags: string[];
    };
    refreshState: FastRefreshState;
}
export declare function errorOverlayReducer(state: Readonly<OverlayState>, action: Readonly<BuildOkAction | BuildErrorAction | BeforeFastRefreshAction | FastRefreshAction | UnhandledErrorAction | UnhandledRejectionAction>): OverlayState;
export {};
