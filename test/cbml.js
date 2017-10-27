
const cbml = require('../')
      

describe("src/cbml.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("querySelector():base", function () {
    examplejs_printLines = [];
  var root = cbml.parse(`
  <!--remove trigger="release">remove1</remove-->
  <!--remove trigger="debug">remove2</remove-->
  <!--remove trigger>remove3</remove-->
  <!--remove>remove4</remove-->
  `)
  examplejs_print(cbml.querySelector(root, 'remove').loc.source)
  assert.equal(examplejs_printLines.join("\n"), "<!--remove trigger=\"release\">remove1</remove-->"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector(root, 'remove[trigger]').loc.source)
  assert.equal(examplejs_printLines.join("\n"), "<!--remove trigger=\"release\">remove1</remove-->"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector(root, 'remove[trigger="debug"]').loc.source)
  assert.equal(examplejs_printLines.join("\n"), "<!--remove trigger=\"debug\">remove2</remove-->"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector(root, 'remove*').length)
  assert.equal(examplejs_printLines.join("\n"), "4"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector(root, 'remove[trigger]*').length)
  assert.equal(examplejs_printLines.join("\n"), "3"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector(root, 'remove[trigger="debug"]*').length)
  assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  });
          
  it("querySelector():coverage", function () {
    examplejs_printLines = [];
  var root = cbml.parse(`
  <!--remove trigger="release">remove1</remove-->
  <!--remove trigger="debug">remove2</remove-->
  <!--remove trigger>remove3</remove-->
  <!--remove>remove4</remove-->
  `)
  examplejs_print(cbml.querySelector(root, 'dev'))
  assert.equal(examplejs_printLines.join("\n"), "null"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector(root))
  assert.equal(examplejs_printLines.join("\n"), "null"); examplejs_printLines = [];
  examplejs_print(cbml.querySelector())
  assert.equal(examplejs_printLines.join("\n"), "null"); examplejs_printLines = [];
  });
          
  it("querySelector():throw", function () {
    examplejs_printLines = [];

  (function() {
  var root = cbml.parse(`
  <!--remove trigger="release">remove1</remove-->
  `)
  cbml.querySelector(root, 'dev//1')
  // * throw
  }).should.throw();
  });
          
});
         