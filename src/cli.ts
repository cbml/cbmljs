#!/usr/bin/env node

import * as cbml from '../'
import * as optimist from 'optimist'
import * as mkdirp from 'mkdirp'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

;(function() {
  let argv = optimist
    .usage('$0 input1.js [input2.js] -o output')
    .alias('o', 'output')
    .describe('o', 'output file.')
    .string('o')
    .alias('v', 'version')
    .describe('v', 'Print version number and exit.')
    .wrap(80).argv

  if (argv.version) {
    let pkg = require('../package.json')
    console.log(pkg.name + ' ' + pkg.version)
    return
  }

  if (argv._.length < 1) {
    console.error('The input file is not specified.')
    return
  }

  var contents = []
  var filenames = []
  argv._.forEach(function(filename) {
    filenames.push(filename)
    let code = fs.readFileSync(filename).toString()
    contents.push(JSON.stringify(cbml.parse(code, argv), null, '  '))
  })
  var content = contents.join('\n')
  if (argv.output) {
    mkdirp.sync(path.dirname(argv.output))
    fs.writeFileSync(argv.output, content)
    console.log(util.format('%j cbml output complete.', filenames))
  } else {
    console.log(content)
  }
})()
