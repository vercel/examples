// @ts-check
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "env", {
    enumerable: true,
    get: ()=>env
});
const env = {
    DEBUG: process.env.DEBUG !== undefined && process.env.DEBUG !== "0"
};
