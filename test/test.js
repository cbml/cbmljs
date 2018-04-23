const cbml = require('../')
const assert = require('should')
const fs = require('fs')
const util = require('util')
const path = require('path')
const yaml = require('js-yaml')

/**
 * 清除 \r，为兼容 Windows 下的文本换行符 CRLF
 */
function cleanCRLF(text) {
  return String(text).replace(/\r\n?/g, '\n')
}

describe('coverage', function() {
  it('empty string', function() {
    var root = cbml.parse('')
    assert.equal(typeof root, 'object')
    assert.equal(root.loc.source, '')
  })

  it('ignore source', function() {
    var root = cbml.parse('/*<cctv>*//*<cctv>*//*<cctv>*/cctv/*</cctv>*/', {
      source: false,
    })
    assert.equal(root.loc.source, null)
  })

  it('ignore location', function() {
    var root = cbml.parse('/*<cctv>*//*<cctv>*//*<cctv>*/cctv/*</cctv>*/', {
      loc: false,
    })
    assert.equal(root.loc, null)
  })

  it('get range', function() {
    var root = cbml.parse('/*<cctv>*//*<cctv>*//*<cctv>*/cctv/*</cctv>*/', {
      range: true,
    })
    assert.equal(String(root.range), '0,45')
  })

  it('empty params', function() {
    var root = cbml.parse()
    assert.equal(root, null)
  })

  it('xml compatible', function() {
    var root = cbml.parse('<!--xml data="1"')
    assert.equal(root.body[0].type, 'TextNode')
    assert.equal(root.body[0].content, '<!--xml data="1"')
  })

  it('c compatible', function() {
    var root = cbml.parse(
      '{/*<Checkbox defaultChecked={isIPage} name="isFolder"'
    )
    assert.equal(root.body[0].type, 'TextNode')
    assert.equal(
      root.body[0].content,
      '{/*<Checkbox defaultChecked={isIPage} name="isFolder"'
    )
  })
})

describe('fixtures', function() {
  var dirname = 'test/fixtures'
  var items = fs
    .readdirSync(dirname)
    .filter(function(item) {
      return /\.input\.(\w+)$/.test(item)
    })
    .forEach(function(input) {
      var output = input.replace(/\.input\.(\w+)$/, '.output.$1.yml')
      it(input, function() {
        if (/\.throw\./.test(input)) {
          // 出现异常
          ;(function() {
            cbml.parse(fs.readFileSync(path.join(dirname, input)))
          }.should.throw())
          return
        }

        assert.equal(
          yaml.dump(cbml.parse(fs.readFileSync(path.join(dirname, input))), null, '  '),
          cleanCRLF(fs.readFileSync(path.join(dirname, output)))
        )
      })
    })
})
