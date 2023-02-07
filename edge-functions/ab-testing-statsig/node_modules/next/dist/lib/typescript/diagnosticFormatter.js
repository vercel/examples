"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFormattedDiagnostic = getFormattedDiagnostic;
exports.DiagnosticCategory = void 0;
var _codeFrame = require("next/dist/compiled/babel/code-frame");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var DiagnosticCategory;
exports.DiagnosticCategory = DiagnosticCategory;
(function(DiagnosticCategory) {
    DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
    DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
    DiagnosticCategory[DiagnosticCategory["Suggestion"] = 2] = "Suggestion";
    DiagnosticCategory[DiagnosticCategory["Message"] = 3] = "Message";
})(DiagnosticCategory || (exports.DiagnosticCategory = DiagnosticCategory = {}));
function getFormattedLayoutAndPageDiagnosticMessageText(baseDir, diagnostic) {
    var ref, ref1;
    const message = diagnostic.messageText;
    const sourceFilepath = ((ref1 = (ref = diagnostic.file) == null ? void 0 : ref.text.trim().match(/^\/\/ File: (.+)\n/)) == null ? void 0 : ref1[1]) || "";
    if (sourceFilepath && typeof message !== "string") {
        const relativeSourceFile = _path.default.relative(baseDir, sourceFilepath);
        const type = /'typeof import\(".+page"\)'/.test(message.messageText) ? "Page" : "Layout";
        // Reference of error codes:
        // https://github.com/Microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json
        switch(message.code){
            case 2344:
                const filepathAndType = message.messageText.match(/'typeof import\("(.+)"\)'.+'(.+)'/);
                if (filepathAndType) {
                    let main = `${type} "${_chalk.default.bold(relativeSourceFile)}" does not match the required types of a Next.js ${type}.`;
                    function processNext(indent, next) {
                        if (!next) return;
                        for (const item of next){
                            switch(item.code){
                                case 2200:
                                    const mismatchedField = item.messageText.match(/The types of '(.+)'/);
                                    if (mismatchedField) {
                                        main += "\n" + " ".repeat(indent * 2);
                                        main += `"${_chalk.default.bold(mismatchedField[1])}" has the wrong type:`;
                                    }
                                    break;
                                case 2322:
                                    const types = item.messageText.match(/Type '(.+)' is not assignable to type '(.+)'./);
                                    if (types) {
                                        main += "\n" + " ".repeat(indent * 2);
                                        if (types[2] === "PageComponent" || types[2] === "LayoutComponent") {
                                            main += `The exported ${type} component isn't correctly typed.`;
                                        } else {
                                            main += `Expected "${_chalk.default.bold(types[2].replace('"__invalid_negative_number__"', "number (>= 0)"))}", got "${_chalk.default.bold(types[1])}".`;
                                        }
                                    }
                                    break;
                                case 2326:
                                    main += "\n" + " ".repeat(indent * 2);
                                    main += `Invalid configuration:`;
                                    break;
                                case 2739:
                                    const invalidProp = item.messageText.match(/Type '(.+)' is missing the following properties from type '(.+)'/);
                                    if (invalidProp) {
                                        if (invalidProp[1] === "LayoutProps" || invalidProp[1] === "PageProps") {
                                            main += "\n" + " ".repeat(indent * 2);
                                            main += `Prop "${invalidProp[2]}" is incompatible with the ${type}.`;
                                        }
                                    }
                                    break;
                                case 2559:
                                    const invalid = item.messageText.match(/Type '(.+)' has/);
                                    if (invalid) {
                                        main += "\n" + " ".repeat(indent * 2);
                                        main += `Type "${_chalk.default.bold(invalid[1])}" isn't allowed.`;
                                    }
                                    break;
                                case 2741:
                                    const incompatPageProp = item.messageText.match(/Property '(.+)' is missing in type 'PageProps'/);
                                    if (incompatPageProp) {
                                        main += "\n" + " ".repeat(indent * 2);
                                        main += `Prop "${_chalk.default.bold(incompatPageProp[1])}" will never be passed. Remove it from the component's props.`;
                                    } else {
                                        const extraLayoutProp = item.messageText.match(/Property '(.+)' is missing in type 'LayoutProps' but required in type '(.+)'/);
                                        if (extraLayoutProp) {
                                            main += "\n" + " ".repeat(indent * 2);
                                            main += `Prop "${_chalk.default.bold(extraLayoutProp[1])}" is not valid for this Layout, remove it to fix.`;
                                        }
                                    }
                                    break;
                                default:
                            }
                            processNext(indent + 1, item.next);
                        }
                    }
                    processNext(1, message.next);
                    return main;
                }
                break;
            case 2345:
                const filepathAndInvalidExport = message.messageText.match(/'typeof import\("(.+)"\)'.+Impossible<"(.+)">/);
                if (filepathAndInvalidExport) {
                    const main = `${type} "${_chalk.default.bold(relativeSourceFile)}" exports an invalid "${_chalk.default.bold(filepathAndInvalidExport[2])}" field. ${type} should only export a default React component and configuration options. Learn more: https://nextjs.org/docs/messages/invalid-segment-export`;
                    return main;
                }
                break;
            default:
        }
    }
}
async function getFormattedDiagnostic(ts, baseDir, diagnostic, isAppDirEnabled) {
    var ref;
    // If the error comes from .next/types/, we handle it specially.
    const isLayoutOrPageError = isAppDirEnabled && ((ref = diagnostic.file) == null ? void 0 : ref.fileName.includes(_path.default.join(baseDir, ".next", "types")));
    let message = "";
    const layoutReason = isLayoutOrPageError ? getFormattedLayoutAndPageDiagnosticMessageText(baseDir, diagnostic) : null;
    const reason = layoutReason || ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    const category = diagnostic.category;
    switch(category){
        // Warning
        case 0:
            {
                message += _chalk.default.yellow.bold("Type warning") + ": ";
                break;
            }
        // Error
        case 1:
            {
                message += _chalk.default.red.bold("Type error") + ": ";
                break;
            }
        // 2 = Suggestion, 3 = Message
        case 2:
        case 3:
        default:
            {
                message += _chalk.default.cyan.bold(category === 2 ? "Suggestion" : "Info") + ": ";
                break;
            }
    }
    message += reason + "\n";
    if (!isLayoutOrPageError && diagnostic.file) {
        const pos = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const line = pos.line + 1;
        const character = pos.character + 1;
        let fileName = _path.default.posix.normalize(_path.default.relative(baseDir, diagnostic.file.fileName).replace(/\\/g, "/"));
        if (!fileName.startsWith(".")) {
            fileName = "./" + fileName;
        }
        message = _chalk.default.cyan(fileName) + ":" + _chalk.default.yellow(line.toString()) + ":" + _chalk.default.yellow(character.toString()) + "\n" + message;
        message += "\n" + (0, _codeFrame).codeFrameColumns(diagnostic.file.getFullText(diagnostic.file.getSourceFile()), {
            start: {
                line: line,
                column: character
            }
        }, {
            forceColor: true
        });
    }
    return message;
}

//# sourceMappingURL=diagnosticFormatter.js.map