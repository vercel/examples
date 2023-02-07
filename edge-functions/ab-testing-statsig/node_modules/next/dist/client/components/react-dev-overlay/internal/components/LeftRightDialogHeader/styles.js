"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.styles = void 0;
var _noopTemplate = require("../../helpers/noop-template");
const styles = _noopTemplate.noop`
  [data-nextjs-dialog-left-right] {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: space-between;
  }
  [data-nextjs-dialog-left-right] > nav > button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: calc(var(--size-gap-double) + var(--size-gap));
    height: calc(var(--size-gap-double) + var(--size-gap));
    font-size: 0;
    border: none;
    background-color: rgba(255, 85, 85, 0.1);
    color: var(--color-ansi-red);
    cursor: pointer;
    transition: background-color 0.25s ease;
  }
  [data-nextjs-dialog-left-right] > nav > button > svg {
    width: auto;
    height: calc(var(--size-gap) + var(--size-gap-half));
  }
  [data-nextjs-dialog-left-right] > nav > button:hover {
    background-color: rgba(255, 85, 85, 0.2);
  }
  [data-nextjs-dialog-left-right] > nav > button:disabled {
    background-color: rgba(255, 85, 85, 0.1);
    color: rgba(255, 85, 85, 0.4);
    cursor: not-allowed;
  }

  [data-nextjs-dialog-left-right] > nav > button:first-of-type {
    border-radius: var(--size-gap-half) 0 0 var(--size-gap-half);
    margin-right: 1px;
  }
  [data-nextjs-dialog-left-right] > nav > button:last-of-type {
    border-radius: 0 var(--size-gap-half) var(--size-gap-half) 0;
  }

  [data-nextjs-dialog-left-right] > button:last-of-type {
    border: 0;
    padding: 0;

    background-color: transparent;
    appearance: none;

    opacity: 0.4;
    transition: opacity 0.25s ease;
  }
  [data-nextjs-dialog-left-right] > button:last-of-type:hover {
    opacity: 0.7;
  }
`;
exports.styles = styles;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=styles.js.map