const fs = require('fs')
const path = require('path')

var filename = path.join(__dirname, 'package.json')
var pkg = JSON.parse(fs.readFileSync(filename))
pkg.main = 'lib/' + pkg.name
pkg.version = pkg.version.replace(/-?\d+$/, function(value) {
  return parseInt(value) + 1
})

fs.writeFileSync(filename, JSON.stringify(pkg, null, '  '))

var bower_filename = path.join(__dirname, 'bower.json')
var bower_pkg = JSON.parse(fs.readFileSync(bower_filename))
bower_pkg.name = pkg.name
bower_pkg.description = pkg.description
bower_pkg.keywords = pkg.keywords
bower_pkg.version = pkg.version
bower_pkg.authors = pkg.authors
fs.writeFileSync(bower_filename, JSON.stringify(bower_pkg, null, '  '))
