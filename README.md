#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> CBML Parser


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
[travis-url]: https://travis-ci.org/cbml/node-cbml
[travis-image]: https://travis-ci.org/cbml/node-cbml.svg?branch=master
