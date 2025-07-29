"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = void 0;
/* eslint-disable @typescript-eslint/require-await */
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const htmlEscape = (str) => str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const buildHtmlTemplate = (title, script, nodesData, style) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>${htmlEscape(title)}</title>
  <style>
${style}
  </style>
</head>
<body>
  <main></main>
  <script>
  /*<!--*/
${script}
  /*-->*/
  </script>
  <script>
    /*<!--*/
    const data = ${nodesData};

    const run = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const chartNode = document.querySelector("main");
      drawChart.default(chartNode, data, width, height);
    };

    window.addEventListener('resize', run);

    document.addEventListener('DOMContentLoaded', run);
    /*-->*/
  </script>
</body>
</html>

`;
const buildHtml = (template) => async ({ title, data }) => {
    const [script, style] = await Promise.all([
        fs_1.promises.readFile(path_1.default.join(__dirname, "..", "lib", `${template}.js`), "utf8"),
        fs_1.promises.readFile(path_1.default.join(__dirname, "..", "lib", `${template}.css`), "utf8"),
    ]);
    return buildHtmlTemplate(title, script, data, style);
};
const outputRawData = (strData) => {
    const data = JSON.parse(strData);
    return JSON.stringify(data, null, 2);
};
const outputPlainTextList = (strData) => {
    var _a;
    const data = JSON.parse(strData);
    const bundles = {};
    for (const meta of Object.values(data.nodeMetas)) {
        for (const [bundleId, uid] of Object.entries(meta.moduleParts)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { metaUid: mainUid, ...lengths } = data.nodeParts[uid];
            bundles[bundleId] = (_a = bundles[bundleId]) !== null && _a !== void 0 ? _a : [];
            bundles[bundleId].push([meta.id, lengths]);
        }
    }
    const bundlesEntries = Object.entries(bundles).sort((e1, e2) => e1[0].localeCompare(e2[0]));
    let output = "";
    const IDENT = "  ";
    for (const [bundleId, files] of bundlesEntries) {
        output += bundleId + ":\n";
        files.sort((e1, e2) => e1[0].localeCompare(e2[0]));
        for (const [file, lengths] of files) {
            output += IDENT + file + ":\n";
            output += IDENT + IDENT + `rendered: ${String(lengths.renderedLength)}\n`;
            if (data.options.gzip) {
                output += IDENT + IDENT + `gzip: ${String(lengths.gzipLength)}\n`;
            }
            if (data.options.brotli) {
                output += IDENT + IDENT + `brotli: ${String(lengths.brotliLength)}\n`;
            }
        }
    }
    return output;
};
const TEMPLATE_TYPE_RENDERED = {
    network: buildHtml("network"),
    sunburst: buildHtml("sunburst"),
    treemap: buildHtml("treemap"),
    "raw-data": async ({ data }) => outputRawData(data),
    list: async ({ data }) => outputPlainTextList(data),
    flamegraph: buildHtml("flamegraph"),
};
const renderTemplate = (templateType, options) => {
    return TEMPLATE_TYPE_RENDERED[templateType](options);
};
exports.renderTemplate = renderTemplate;
