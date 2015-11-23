var assert = require('should');
var cbml = require('../.');
var util = require('util');
var printValue;
function print(value) {
  if (typeof printValue !== 'undefined') {
    throw new Error('Test case does not match.');
  }
  printValue = value;
}
describe("./src/cbml.js", function () {
  printValue = undefined;
  it("tokenizer():base", function () {
    print(JSON.stringify(cbml.tokenizer('(*<' + 'jdists import="base.js" />*)')[0].attrs));
    assert.equal(printValue, "{\"import\":\"base.js\"}"); printValue = undefined;
  });
});
