#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> CBML Parser

## Struct

```json
{
    "type": "block", // token type : "text" | "block" | "single"
    "pos": 7, // Starting position
    "endpos": 333, // End position
    "value": "/*<jdists>*/.../*</jdists>*/", // All value // as "{{prefix}}" + "{{content}}" + "{{suffix}}"
    "tag": "jdists", // tag name
    "language": "c", // language : "c" | "pascal" | "python" | "lua"
    "attrs": {},
	"line": 1, // Line Numbers
	"col": 8 // Column number
    "nodes": [
       ...
    ],
	"content": "...",
	"prefix": "/*<jdists>*/",
	"suffix": "/*</jdists>*/"
}
```

## Install

```sh
$ npm install --save cbml
```

## Usage

```js
var cbml = require('cbml');

console.log(cbml.parse('/*<hello />*/'));
```

```sh
$ npm install --global cbml
$ cbml --help
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/cbml
[npm-image]: https://badge.fury.io/js/cbml.svg
[travis-url]: https://travis-ci.org/cbml/cbmljs
[travis-image]: https://travis-ci.org/cbml/cbmljs.svg?branch=master
