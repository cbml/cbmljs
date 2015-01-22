#!/usr/bin/env node
'use strict';
var cbml = require('./');
var optimist = require('optimist');
var fs = require('fs');
var path = require('path');
var util = require('util');

/*
 * 保证目录存在
 *
 * @param{String} dir 目录
 */
function forceDirSync(dir) {
  if (!fs.existsSync(dir)) {
    forceDirSync(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

var argv = optimist
  .usage('$0 input1.js [input2.js] -o output')
  .alias("o", "output")
  .describe('o', 'output file.')
  .string('o')
  .alias("v", "version")
  .describe("v", "Print version number and exit.")
  .wrap(80)
  .argv;

if (argv.version) {
  var json = require("../package.json");
  util.puts(json.name + ' ' + json.version);
  return;
}

if (argv._.length < 1) {
  util.puts('The input file is not specified.');
  return;
}

var contents = [];
var filenames = [];
argv._.forEach(function(filename) {
  filenames.push(filename);
  contents.push(JSON.stringify(cbml.parse(fs.readFileSync(filename), argv)));
});
var content = contents.join('\n');
if (argv.output) {
  forceDirSync(path.dirname(argv.output));
  fs.writeFileSync(argv.output, content);
  util.puts(util.format('%j cbml output complete.', filenames));
} else {
  console.log(content);
}