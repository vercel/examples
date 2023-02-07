import _extends from "@swc/helpers/src/_extends.mjs";
import * as React from 'react';
import { ACTION_UNHANDLED_ERROR, ACTION_UNHANDLED_REJECTION } from '../error-overlay-reducer';
import { Dialog, DialogBody, DialogContent, DialogHeader } from '../components/Dialog';
import { LeftRightDialogHeader } from '../components/LeftRightDialogHeader';
import { Overlay } from '../components/Overlay';
import { Toast } from '../components/Toast';
import { getErrorByType } from '../helpers/getErrorByType';
import { getErrorSource } from '../helpers/nodeStackFrames';
import { noop as css } from '../helpers/noop-template';
import { CloseIcon } from '../icons/CloseIcon';
import { RuntimeError } from './RuntimeError';
function getErrorSignature(ev) {
    const { event  } = ev;
    switch(event.type){
        case ACTION_UNHANDLED_ERROR:
        case ACTION_UNHANDLED_REJECTION:
            {
                return `${event.reason.name}::${event.reason.message}::${event.reason.stack}`;
            }
        default:
            {}
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    return '';
}
const HotlinkedText = function HotlinkedText(props) {
    const { text  } = props;
    const linkRegex = /https?:\/\/[^\s/$.?#].[^\s"]*/i;
    return /*#__PURE__*/ React.createElement(React.Fragment, null, linkRegex.test(text) ? text.split(' ').map((word, index, array)=>{
        if (linkRegex.test(word)) {
            return /*#__PURE__*/ React.createElement(React.Fragment, {
                key: `link-${index}`
            }, /*#__PURE__*/ React.createElement("a", {
                href: word
            }, word), index === array.length - 1 ? '' : ' ');
        }
        return index === array.length - 1 ? /*#__PURE__*/ React.createElement(React.Fragment, {
            key: `text-${index}`
        }, word) : /*#__PURE__*/ React.createElement(React.Fragment, {
            key: `text-${index}`
        }, word, " ");
    }) : text);
};
export const Errors = function Errors({ errors , initialDisplayState ,  }) {
    const [lookups, setLookups] = React.useState({});
    const [readyErrors, nextError] = React.useMemo(()=>{
        let ready = [];
        let next = null;
        // Ensure errors are displayed in the order they occurred in:
        for(let idx = 0; idx < errors.length; ++idx){
            const e = errors[idx];
            const { id  } = e;
            if (id in lookups) {
                ready.push(lookups[id]);
                continue;
            }
            // Check for duplicate errors
            if (idx > 0) {
                const prev = errors[idx - 1];
                if (getErrorSignature(prev) === getErrorSignature(e)) {
                    continue;
                }
            }
            next = e;
            break;
        }
        return [
            ready,
            next
        ];
    }, [
        errors,
        lookups
    ]);
    const isLoading = React.useMemo(()=>{
        return readyErrors.length < 1 && Boolean(errors.length);
    }, [
        errors.length,
        readyErrors.length
    ]);
    React.useEffect(()=>{
        if (nextError == null) {
            return;
        }
        let mounted = true;
        getErrorByType(nextError).then((resolved)=>{
            // We don't care if the desired error changed while we were resolving,
            // thus we're not tracking it using a ref. Once the work has been done,
            // we'll store it.
            if (mounted) {
                setLookups((m)=>_extends({}, m, {
                        [resolved.id]: resolved
                    }));
            }
        }, ()=>{
        // TODO: handle this, though an edge case
        });
        return ()=>{
            mounted = false;
        };
    }, [
        nextError
    ]);
    const [displayState, setDisplayState] = React.useState(initialDisplayState);
    const [activeIdx, setActiveIndex] = React.useState(0);
    const previous = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setActiveIndex((v)=>Math.max(0, v - 1));
    }, []);
    const next1 = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setActiveIndex((v)=>Math.max(0, Math.min(readyErrors.length - 1, v + 1)));
    }, [
        readyErrors.length
    ]);
    var _activeIdx;
    const activeError = React.useMemo(()=>(_activeIdx = readyErrors[activeIdx]) != null ? _activeIdx : null, [
        activeIdx,
        readyErrors
    ]);
    // Reset component state when there are no errors to be displayed.
    // This should never happen, but lets handle it.
    React.useEffect(()=>{
        if (errors.length < 1) {
            setLookups({});
            setDisplayState('hidden');
            setActiveIndex(0);
        }
    }, [
        errors.length
    ]);
    const minimize = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState('minimized');
    }, []);
    const hide = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState('hidden');
    }, []);
    const fullscreen = React.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState('fullscreen');
    }, []);
    // This component shouldn't be rendered with no errors, but if it is, let's
    // handle it gracefully by rendering nothing.
    if (errors.length < 1 || activeError == null) {
        return null;
    }
    if (isLoading) {
        // TODO: better loading state
        return /*#__PURE__*/ React.createElement(Overlay, null);
    }
    if (displayState === 'hidden') {
        return null;
    }
    if (displayState === 'minimized') {
        return /*#__PURE__*/ React.createElement(Toast, {
            className: "nextjs-toast-errors-parent",
            onClick: fullscreen
        }, /*#__PURE__*/ React.createElement("div", {
            className: "nextjs-toast-errors"
        }, /*#__PURE__*/ React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, /*#__PURE__*/ React.createElement("circle", {
            cx: "12",
            cy: "12",
            r: "10"
        }), /*#__PURE__*/ React.createElement("line", {
            x1: "12",
            y1: "8",
            x2: "12",
            y2: "12"
        }), /*#__PURE__*/ React.createElement("line", {
            x1: "12",
            y1: "16",
            x2: "12.01",
            y2: "16"
        })), /*#__PURE__*/ React.createElement("span", null, readyErrors.length, " error", readyErrors.length > 1 ? 's' : ''), /*#__PURE__*/ React.createElement("button", {
            "data-nextjs-toast-errors-hide-button": true,
            className: "nextjs-toast-errors-hide-button",
            type: "button",
            onClick: (e)=>{
                e.stopPropagation();
                hide();
            },
            "aria-label": "Hide Errors"
        }, /*#__PURE__*/ React.createElement(CloseIcon, null))));
    }
    const isServerError = [
        'server',
        'edge-server'
    ].includes(getErrorSource(activeError.error) || '');
    return /*#__PURE__*/ React.createElement(Overlay, null, /*#__PURE__*/ React.createElement(Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_errors_label",
        "aria-describedby": "nextjs__container_errors_desc",
        onClose: isServerError ? undefined : minimize
    }, /*#__PURE__*/ React.createElement(DialogContent, null, /*#__PURE__*/ React.createElement(DialogHeader, {
        className: "nextjs-container-errors-header"
    }, /*#__PURE__*/ React.createElement(LeftRightDialogHeader, {
        previous: activeIdx > 0 ? previous : null,
        next: activeIdx < readyErrors.length - 1 ? next1 : null,
        close: isServerError ? undefined : minimize
    }, /*#__PURE__*/ React.createElement("small", null, /*#__PURE__*/ React.createElement("span", null, activeIdx + 1), " of", ' ', /*#__PURE__*/ React.createElement("span", null, readyErrors.length), " unhandled error", readyErrors.length < 2 ? '' : 's')), /*#__PURE__*/ React.createElement("h1", {
        id: "nextjs__container_errors_label"
    }, isServerError ? 'Server Error' : 'Unhandled Runtime Error'), /*#__PURE__*/ React.createElement("p", {
        id: "nextjs__container_errors_desc"
    }, activeError.error.name, ":", ' ', /*#__PURE__*/ React.createElement(HotlinkedText, {
        text: activeError.error.message
    })), isServerError ? /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("small", null, "This error happened while generating the page. Any console logs will be displayed in the terminal window.")) : undefined), /*#__PURE__*/ React.createElement(DialogBody, {
        className: "nextjs-container-errors-body"
    }, /*#__PURE__*/ React.createElement(RuntimeError, {
        key: activeError.id.toString(),
        error: activeError
    })))));
};
export const styles = css`
  .nextjs-container-errors-header > h1 {
    font-size: var(--size-font-big);
    line-height: var(--size-font-bigger);
    font-weight: bold;
    margin: 0;
    margin-top: calc(var(--size-gap-double) + var(--size-gap-half));
  }
  .nextjs-container-errors-header small {
    font-size: var(--size-font-small);
    color: var(--color-accents-1);
    margin-left: var(--size-gap-double);
  }
  .nextjs-container-errors-header small > span {
    font-family: var(--font-stack-monospace);
  }
  .nextjs-container-errors-header > p {
    font-family: var(--font-stack-monospace);
    font-size: var(--size-font-small);
    line-height: var(--size-font-big);
    font-weight: bold;
    margin: 0;
    margin-top: var(--size-gap-half);
    color: var(--color-ansi-red);
    white-space: pre-wrap;
  }
  .nextjs-container-errors-header > div > small {
    margin: 0;
    margin-top: var(--size-gap-half);
  }
  .nextjs-container-errors-header > p > a {
    color: var(--color-ansi-red);
  }

  .nextjs-container-errors-body > h5:not(:first-child) {
    margin-top: calc(var(--size-gap-double) + var(--size-gap));
  }
  .nextjs-container-errors-body > h5 {
    margin-bottom: var(--size-gap);
  }

  .nextjs-toast-errors-parent {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .nextjs-toast-errors-parent:hover {
    transform: scale(1.1);
  }
  .nextjs-toast-errors {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .nextjs-toast-errors > svg {
    margin-right: var(--size-gap);
  }
  .nextjs-toast-errors-hide-button {
    margin-left: var(--size-gap-triple);
    border: none;
    background: none;
    color: var(--color-ansi-bright-white);
    padding: 0;
    transition: opacity 0.25s ease;
    opacity: 0.7;
  }
  .nextjs-toast-errors-hide-button:hover {
    opacity: 1;
  }
`;

//# sourceMappingURL=Errors.js.map