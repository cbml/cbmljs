function define(fn) {
  fn();
}
define.amd = true;
GLOBAL.define = define;
require('../.');
var keys = Object.keys(require.cache);
keys.every(function (key) {
  if (key.indexOf('cbml.js') >= 0) {
    delete require.cache[key];
    return false;
  }
  return true;
});
GLOBAL.define = null;