var hello = require('../othermodule.js'); // require a second ("child") mondule
// micro-module to test functionality
(function() {
	'use strict';

  var runcount = false;
  console.log("Hello module says: " + hello()); // super useful module ;-)

  var get = function () {
    return runcount;
  }

  var set = function () {
    runcount = runcount + 1;
    return runcount;
  }

  module.exports = {
    get: get,
    set: set
  };

}()); // benalman.com/news/2010/11/immediately-invoked-function-expression
