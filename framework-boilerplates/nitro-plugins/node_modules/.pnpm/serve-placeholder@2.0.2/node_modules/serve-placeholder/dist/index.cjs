'use strict';

const defu = require('defu');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const defu__default = /*#__PURE__*/_interopDefaultCompat(defu);

const DefaultOptions = {
  statusCode: 404,
  skipUnknown: false,
  cacheHeaders: true,
  placeholderHeader: true,
  handlers: {
    // css
    ".css": "css",
    // html
    ".html": "html",
    ".htm": "html",
    // image
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".gif": "image",
    ".svg": "image",
    ".webp": "image",
    ".bmp": "image",
    ".ico": "image",
    // js
    ".js": "js",
    // json
    ".json": "json",
    // map
    ".map": "map",
    // plain
    ".txt": "plain",
    ".text": "plain",
    ".md": "plain"
  },
  placeholders: {
    css: "/* style not found */",
    default: void 0,
    html: "<!-- page not found -->",
    image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    js: "/* script not found */",
    json: "{}",
    map: '{"version": "3", "sources": [], "mappings": "" }',
    plain: ""
  },
  mimes: {
    css: "text/css",
    default: void 0,
    html: "text/html",
    js: "application/javascript",
    json: "application/json",
    image: "image/gif",
    map: "application/json",
    plain: "text/plain"
  }
};

const EXT_REGEX = /\.[\dA-Za-z]+$/;
function servePlaceholder(_options = {}) {
  const options = defu__default(_options, DefaultOptions);
  return function servePlaceholderMiddleware(req, res, next) {
    if (res.writableEnded) {
      return;
    }
    const url = req.url.split("?")[0];
    const ext = (url.match(EXT_REGEX) || [])[0] || "";
    let handler = options.handlers[ext];
    if (handler === false) {
      return next();
    }
    if (handler === void 0) {
      if (options.skipUnknown) {
        return next();
      }
      handler = "default";
    }
    if (options.statusCode) {
      res.statusCode = options.statusCode;
    }
    const mime = options.mimes[handler];
    if (mime) {
      res.setHeader("Content-Type", mime);
    }
    if (options.cacheHeaders) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    if (options.placeholderHeader) {
      res.setHeader("X-Placeholder", handler);
    }
    const placeholder = options.placeholders[handler];
    res.end(placeholder);
  };
}

exports.servePlaceholder = servePlaceholder;
