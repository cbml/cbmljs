/*jshint globalstrict: true*/
/*global require*/

'use strict'

const gulp = require('gulp')
const typescript = require('gulp-typescript')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const examplejs = require('gulp-examplejs')
const merge2 = require('merge2')
const jdists = require('gulp-jdists')
const pkg = require('./package')

gulp.task('build', function () {
  var tsResultParserInterface = gulp.src('src/ast.ts')
    .pipe(gulp.dest('lib'))
    .pipe(typescript({
      target: 'es5',
      declaration: true,
    }))
  var tsResultParser = gulp.src(`src/${pkg.name}.ts`)
    .pipe(jdists())
    .pipe(gulp.dest('lib'))
    .pipe(typescript({
      target: 'es5',
      module: 'umd',
      declaration: true,
    }))

  return merge2([
    tsResultParserInterface.dts.pipe(gulp.dest('./lib')),
    tsResultParser.dts.pipe(gulp.dest('./lib')),
    tsResultParser.js
      .pipe(replace(
        /(\(function\s*\()(factory\)\s*\{)/, '$1root, $2\n    /* istanbul ignore next */'
      ))
      .pipe(replace(
        /(define\(\["require",\s*"exports"\],\s*factory\);\s*\})/, '$1 else { factory(null, root["' + pkg.name + '"] = {}); }'
      ))
      .pipe(replace(
        /(\s*\}\s*\)\s*\()(function\s*\(require,\s*exports\)\s*\{)/, '$1this, $2'
      ))
      .pipe(gulp.dest('./lib')),
  ])
})

gulp.task('cli', function () {
  gulp.src(`src/cli.ts`)
    .pipe(typescript({
      target: 'es5',
    }))
    .pipe(gulp.dest('lib'))
})

gulp.task('uglify', function () {
  gulp.src(`lib/${pkg.name}.js`)
    .pipe(uglify())
    .pipe(rename(`${pkg.name}.min.js`))
    .pipe(gulp.dest('lib'))
})

gulp.task('example', function () {
  return gulp.src(`src/${pkg.name}.ts`)
    .pipe(jdists({
      trigger: 'example'
    }))
    .pipe(examplejs({
      header: `
const ${pkg.name} = require('../')
      `
    }))
    .pipe(replace(/~/g, '--'))
    .pipe(rename(`${pkg.name}.js`))
    .pipe(gulp.dest('test'))
})

gulp.task('dist', ['build', 'example', 'uglify'])