#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cbml = require("../");
var optimist = require("optimist");
var mkdirp = require("mkdirp");
var fs = require("fs");
var path = require("path");
var util = require("util");
(function () {
    var argv = optimist
        .usage('$0 input1.js [input2.js] -o output')
        .alias('o', 'output')
        .describe('o', 'output file.')
        .string('o')
        .alias('v', 'version')
        .describe('v', 'Print version number and exit.')
        .wrap(80)
        .argv;
    if (argv.version) {
        var pkg = require('../package.json');
        console.log(pkg.name + ' ' + pkg.version);
        return;
    }
    if (argv._.length < 1) {
        console.error('The input file is not specified.');
        return;
    }
    var contents = [];
    var filenames = [];
    argv._.forEach(function (filename) {
        filenames.push(filename);
        var code = fs.readFileSync(filename).toString();
        contents.push(JSON.stringify(cbml.parse(code, argv), null, '  '));
    });
    var content = contents.join('\n');
    if (argv.output) {
        mkdirp.sync(path.dirname(argv.output));
        fs.writeFileSync(argv.output, content);
        console.log(util.format('%j cbml output complete.', filenames));
    }
    else {
        console.log(content);
    }
})();
