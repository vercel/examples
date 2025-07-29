// awesome tests here!
var test     = require('tape'); // the reliable testing framework
var setup    = require('../setup'); // ensure decache is pre-loaded
var decache  = require('../decache.js');
var mymodule = require('../lib/mymodule');

console.log(mymodule.count);

test('Expect decache to do nothing if the module name does not exist', function(t) {

  try {
    decache('./non-existing-module');
    t.pass('No error thrown');
    t.end();
  } catch (e) {
    t.fail('This should have not throw an error');
    t.end();
  }
});

test('Expect mymodule.count initial state to be false', function(t) {
  t.equal(mymodule.get(), false, 'count is false! (we have not run this)');
  t.end();
});

test('Increment the value of the count so its 1 (one)', function(t) {
  var runcount = mymodule.set();
  t.equal(runcount, 1, 'runcount is one! (as expected)');
  t.end();
});

test('Increment the value of the count so its 2 (one)', function(t) {
  mymodule.set();
  var runcount = mymodule.get();
  t.equal(runcount, 2, 'runcount is 2!');
  t.end();
});

test('There\'s no going back to initial (runcount) state!', function(t) {
  var runcount = mymodule.get();
  t.equal(runcount, 2, 'runcount cannot be decremented!!');
  t.end();
});

test('Delete Require Cache for mymodule to re-set the runcount!', function(t) {
  decache('../lib/mymodule'); // exercise the decache module
  var other = require('../lib/othermodule.js');
  decache('../lib/othermodule.js');
  mymodule = require('../lib/mymodule');
  var runcount = mymodule.get();
  t.equal(runcount, false, 'runcount is false! (as epxected)');
  t.end();
});

test('Require an npm (non local) module', function(t) {
  var ts = require('tap-spec');
  decache('tap-spec');
  var keys = Object.keys(require.cache);
  t.equal(keys.indexOf('tap-spec'), -1, 'tap-spec no longer in require-cache');
  t.end();
});

test('Fake relative parent module', function(t) {
  var keys = Object.keys(require.cache);
  var p = keys[0]; // the module that required decache
  var obj = require.cache[p];
  console.log(" - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
  require.cache = {};
  require.cache[__filename] = obj;
  console.log(require.cache);
  var other = require('../lib/othermodule.js');
  decache('../lib/othermodule.js');
  keys = Object.keys(require.cache);
  t.equal(keys.indexOf('othermodule.js'), -1, 'fake parent not in require.cache');
  t.end();
});

test('.node extensions are ignored', function(t) {
  require('modern-syslog');
  decache('modern-syslog');
  t.doesNotThrow(function() {
      require('modern-syslog');
  });
  t.end();
});
