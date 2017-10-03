# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

> CBML Parser

## Struct

![cbml](https://cloud.githubusercontent.com/assets/536587/8889268/b5f8a5aa-3305-11e5-8f3d-6af1ccbf1474.png)

```yaml
- type: BlockElement # TextNode, CommonElement, VoidElement, CBMLElement
  attributes: []
  tag: jdists
  language: c # pascal, xml, python, lua
  body:
    - type: TextNode
      content: line1.2
      loc:
        source: line1.2
        start:
          line: 2
          column: 13
        end:
          line: 2
          column: 20
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
[coverage-url]: https://coveralls.io/github/cbml/cbmljs?branch=master
[coverage-image]: https://coveralls.io/repos/cbml/cbmljs/badge.svg?branch=master&service=github
