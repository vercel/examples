"use strict";
var _appBootstrap = require("./app-bootstrap");
(0, _appBootstrap // TODO-APP: build indicator
).appBootstrap(()=>{
    const { hydrate  } = require('./app-index');
    hydrate();
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-next-dev.js.map