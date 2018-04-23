import * as ast from 'cbml-ast'
export { ast }
export interface IParserOptions {
  /**
   * 是否获取位置信息，默认：true
   */
  loc?: boolean
  /**
   * 是否获取源代码信息，默认：true
   */
  source?: boolean
  /**
   * 是否获取代码范围信息，默认：false
   */
  range?: boolean
}
// #region 临时语法元素
/**
 * 文本节点
 */
interface TextNodeTokenizer extends ast.TextNode {
  type: 'TextNode'
}
/**
 * 启始普通块标记
 */
interface LeftBlockTokenizer extends ast.ContainerElement {
  type: 'LeftBlockTokenizer'
}
/**
 * 启始注释块标记
 */
interface LeftCommentTokenizer extends ast.ContainerElement {
  type: 'LeftCommentTokenizer'
}
/**
 * 结束普通块标记
 */
interface RightBlockTokenizer extends ast.ContainerElement {
  type: 'RightBlockTokenizer'
}
/**
 * 结束注释块标记
 */
interface RightCommentTokenizer extends ast.ContainerElement {
  type: 'RightCommentTokenizer'
}
// #endregion
/**
 * @file cbml
 *
 * CBML Parser
 * @author
 *  zswang (http://weibo.com/zswang)
 * @version 1.0.0-alpha.38
 * @date 2018-04-23
 */
    /*<function name="decodeHTML">*/
    /**
     * html编码转换字典
     */
    var htmlDecodeDict = {
        'quot': '"',
        'lt': '<',
        'gt': '>',
        'amp': '&',
        'nbsp': '\u00a0',
    };
    /**
     * HTML解码
     *
     * @param html
     * @example decodeHTML():base
      ```js
      console.log(jstrs.decodeHTML('&#39;1&#39;&nbsp;&lt;&nbsp;&#34;2&quot;'))
      // > '1' < "2"
      ```
      * @example decodeHTML():hex
      ```js
      console.log(jstrs.decodeHTML('&#x33;&#x34;&#97;'))
      // > 34a
      ```
      */
    function decodeHTML(html) {
        return html.replace(/&((quot|lt|gt|amp|nbsp)|#x([a-f\d]+)|#(\d+));/ig, function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var key = params[2];
            var hex = params[3];
            var dec = params[4];
            return key ? htmlDecodeDict[key.toLowerCase()] :
                hex ? String.fromCharCode(parseInt(hex, 16)) :
                    String.fromCharCode(+dec);
        });
    } /*</function>*/
function calcPosition(code: string, offset: number): ast.Position {
  let buffer = code.slice(0, offset).split('\n')
  return {
    line: buffer.length,
    column: buffer[buffer.length - 1].length + 1,
    offset: offset,
  }
}
function calcLocation(
  code: string,
  start: number,
  end: number,
  source: boolean
): ast.SourceLocation {
  return {
    source: source ? code.slice(start, end) : null,
    start: calcPosition(code, start),
    end: calcPosition(code, end),
  }
}
/**
 * 支持的语言形式
 */
const LanguageMap = {
  xml: {
    pattern: ['<!--', '-->'],
    closed: /^\s*(\/?-->)/,
    closed2: /^\s*(\/?-->|>)/,
  },
  c: {
    pattern: ['/*<', '>*/'],
    closed: /^\s*(\/?>\*\/)/,
    closed2: /^\s*(\/?>\*\/|>)/,
  },
  pascal: {
    pattern: ['(*<', '>*)'],
    closed: /^\s*(\/?>\*\))/,
    closed2: /^\s*(\/?>\*\)|>)/,
  },
  python: {
    pattern: ["'''<", ">'''"],
    closed: /^\s*(\/?>''')/,
    closed2: /^\s*(\/?>'''|>)/,
  },
  lua: {
    pattern: ['--[[<', '>]]'],
    closed: /^\s*(\/?>\]\])/,
    closed2: /^\s*(\/?>\]\]|>)/,
  },
}
/**
 * 计算代码块属于的语言类型
 * @param text 文本
 * @return 返回代码块所属语言类型
 */
function calcLanguage(text: string): ast.Language {
  let result
  Object.keys(LanguageMap).some(key => {
    let language = LanguageMap[key]
    if (language.pattern.indexOf(text) >= 0) {
      result = key
      return true
    }
  })
  return result
}
/**
 * 扫描函数类型
 */
interface IScanNodeFunction {
  (token: ast.Node)
}
/**
 * 扫描文本段包含 CBML 的语法元素
 *
 * @param code 代码段
 * @param options 配置项
 * @param scan 扫描函数
 */
function tokenizer(
  code: string,
  options: IParserOptions,
  scan: IScanNodeFunction
) {
  let start = 0
  let end = 0
  /**
   * 记录代码位置信息，并添加 CBML 节点
   * @param node CBML 节点
   */
  function append(node: ast.Node) {
    if (!options.loc) {
      node.loc = null
    } else {
      node.loc = calcLocation(code, start, end, options.source)
    }
    node.range = [start, end]
    scan(node)
    start = end
  }
  while (start < code.length) {
    let match = code
      .slice(start)
      .match(
        /(<!--|\/\*<|\(\*<|'''<|--\[\[<)(\/?)([\w_]+[\w_-]*[\w_]|[\w_]+)\s*|(<\/)([\w_]+[\w_-]*[\w_]|[\w_]+)(>\*\/|>\*\)|>'''|>\]\]|-->)/
      )
    // 没有 CBML 元素
    end = match ? start + match.index : code.length
    if (end > start) {
      append({
        type: 'TextNode',
        content: code.slice(start, end),
        loc: null,
      } as TextNodeTokenizer)
    }
    if (!match) {
      break
    }
    let tag = match[3]
    end += match[0].length
    if (!tag) {
      // 右边闭合
      tag = match[5]
      append({
        type: 'RightCommentTokenizer',
        attributes: null,
        tag: tag,
        language: calcLanguage(match[6]),
      } as RightCommentTokenizer)
      continue
    }
    let language = calcLanguage(match[1])
    if (match[2] === '/') {
      // 闭合便签 // 《！--「/」jdists--》
      let find = LanguageMap[language].closed
      match = code.slice(end).match(find) // 《！--/jdists「--》」
      if (!match) {
        let pos = calcPosition(code, end)
        throw `Uncaught SyntaxError: Can't match ${find}. (line: ${
          pos.line
        }, col: ${pos.column})`
      }
      end += match[0].length
      append({
        type: 'RightBlockTokenizer',
        attributes: null,
        tag: tag,
        language: language,
      } as RightBlockTokenizer)
      continue
    }
    // 属性 // 《！--/jdists「file="1.js" clean」--》」
    // find attrs
    let attributes: ast.Attributes = {}
    while (true) {
      // find attrName
      match = code.slice(end).match(/^\s*([\w_]+[\w_-]*[\w_]|[\w_]+)\s*/)
      if (!match) {
        break
      }
      end += match[0].length
      let name = match[1]
      let attribute: ast.Attribute = {
        value: '',
        quoted: '',
      }
      let value = ''
      // find attrValue
      match = code
        .slice(end)
        .match(/^\s*=\s*('([^']*)'|"([^"]*)"|([^'"\s\/>]+))\s*/)
      if (match) {
        end += match[0].length
        value = match[1]
      }
      switch (value[0]) {
        case '"':
        case "'":
          attribute.quoted = value[0]
          value = value.slice(1, -1)
          break
      }
      attribute.value = decodeHTML(value)
      if (attributes[name] === undefined) {
        attributes[name] = attribute
      }
    }
    let find = LanguageMap[language].closed2
    match = code.slice(end).match(find)
    if (!match) {
      if (language === 'xml') {
        // xml 则宽松一些 // <!~1. line<br>~>
        match = code.slice(end).match(/^[^]*?-->/)
        if (match) {
          end += match[0].length
        } else {
          end = code.length
        }
        append({
          type: 'TextNode',
          content: code.slice(start, end),
          loc: null,
        } as TextNodeTokenizer)
        continue
      }
      if (language === 'c') {
        // jsx
        if (
          Object.keys(attributes).some(name => {
            let attribute = attributes[name]
            return attribute.quoted === '' && /^\s*\{/.test(attribute.value)
          })
        ) {
          match = code.slice(end).match(/^[^]*?>\*\//)
          if (match) {
            end += match[0].length
          } else {
            end = code.length
          }
          append({
            type: 'TextNode',
            content: code.slice(start, end),
            loc: null,
          } as TextNodeTokenizer)
          continue
        }
      }
      let pos = calcPosition(code, end)
      throw `Uncaught SyntaxError: Can't match ${find}. (line: ${
        pos.line
      }, col: ${pos.column})`
    }
    end += match[0].length
    let element: ast.Element
    if (match[1] === '>') {
      // 需要闭合 // 《！--/jdists》...《/jdists--》」
      element = {
        type: 'LeftCommentTokenizer',
        attributes: attributes,
        tag: tag,
        language: language,
        body: [],
      } as LeftCommentTokenizer
    } else if (match[1][0] === '/') {
      element = {
        type: 'VoidElement',
        attributes: attributes,
        tag: tag,
        language: language,
      } as ast.VoidElement
    } else {
      element = {
        type: 'LeftBlockTokenizer',
        attributes: attributes,
        tag: tag,
        language: language,
        body: [],
      } as LeftBlockTokenizer
    }
    append(element)
  }
}
/**
 * 将没有闭合的左侧标签转换成文本节点，并合并相邻的文本节点
 *
 * @param code 当前代码
 * @param body 父节点
 */
function merge(code: string, parent: ast.ContainerElement) {
  if (!parent || !parent.body) {
    return
  }
  for (let i = parent.body.length - 1; i >= 0; i--) {
    let node = parent.body[i]
    let container = node as ast.ContainerElement
    merge(code, container)
    if (
      ['LeftBlockTokenizer', 'LeftCommentTokenizer'].indexOf(node.type) >= 0
    ) {
      let token = node as LeftBlockTokenizer
      let TextNode: TextNodeTokenizer = {
        type: 'TextNode',
        loc: node.loc,
        content: code.slice(token.range[0], token.range[1]),
        range: token.range,
      }
      node = parent.body[i] = TextNode
      let firstChild = token.body[0]
      if (firstChild) {
        let lastChild = token.body[token.body.length - 1]
        if (node.loc) {
          node.loc.end = {
            line: firstChild.loc.start.line,
            column: firstChild.loc.start.column,
            offset: firstChild.loc.start.offset,
          }
        }
        let params = [i + 1, 0]
        params.push.apply(params, token.body)
        params.splice.apply(parent.body, params)
      }
    }
    let nextNode = parent.body[i + 1] as TextNodeTokenizer
    if (nextNode && node.type === 'TextNode' && nextNode.type === 'TextNode') {
      // 合并文本
      let t = node as TextNodeTokenizer
      nextNode.range[0] = t.range[0]
      if (nextNode.loc) {
        nextNode.loc.start = {
          line: node.loc.start.line,
          column: node.loc.start.column,
          offset: node.loc.start.offset,
        }
        if (nextNode.loc.source) {
          nextNode.loc.source = code.slice(nextNode.range[0], nextNode.range[1])
        }
      }
      nextNode.content = code.slice(nextNode.range[0], nextNode.range[1])
      parent.body.splice(i, 1)
    }
  }
}
/**
 * 清除仅解析期使用的字段
 *
 * @param parent 容器节点
 */
function clean(parent: ast.ContainerElement) {
  delete parent.range
  if (!parent.body) {
    return
  }
  parent.body.forEach(node => {
    clean(node as ast.ContainerElement)
  })
}
/**
 * 解析代码片段包含的 CBML 元素
 *
 * @param code 代码片段
 * @param options 配置项
 * @return 返回 CBML 元素
 */
export function parse(code: string, options?: IParserOptions): ast.CBMLElement {
  if (code === null || code === undefined) {
    return null
  }
  options = options || {}
  options.loc = options.loc === undefined ? true : options.loc
  options.source = options.source === undefined ? true : options.source
  options.range = options.range === undefined ? false : options.range
  code = String(code)
  let loc: ast.SourceLocation = options.loc
    ? calcLocation(code, 0, code.length, options.source)
    : null
  let result: ast.CBMLElement = {
    language: 'cbml',
    tag: '#cbml',
    attributes: {},
    type: 'CBMLElement',
    body: [],
    loc: loc,
    range: [0, code.length],
  }
  if (!code) {
    return result
  }
  let lefts: ast.Node[] = [] // 左边标签集合，用于寻找配对的右边标签
  let current: ast.ContainerElement = result // 当前容器
  tokenizer(code, options, (token: ast.Node) => {
    switch (token.type) {
      case 'VoidElement':
      case 'TextNode':
        current.body.push(token)
        current.range[1] = token.range[1]
        break
      case 'LeftBlockTokenizer':
      case 'LeftCommentTokenizer':
        current.body.push(token)
        let container = token as LeftBlockTokenizer
        lefts.push(container)
        current = container
        break
      case 'RightBlockTokenizer':
      case 'RightCommentTokenizer':
        let tokenizer = token as RightBlockTokenizer
        for (let i = lefts.length - 1; ; i--) {
          let curr = lefts[i] as ast.ContainerElement
          let prev = lefts[i - 1]
          if (!curr) {
            throw `No start tag. (${tokenizer.tag})`
          }
          if (
            curr.tag == tokenizer.tag &&
            curr.language == tokenizer.language &&
            curr.type.slice('Left'.length) === token.type.slice('Right'.length)
          ) {
            // 匹配
            if (token.type === 'RightBlockTokenizer') {
              curr.type = 'BlockElement'
            } else {
              curr.type = 'CommentElement'
            }
            curr.range[1] = tokenizer.range[1]
            if (curr.loc) {
              curr.loc.end = {
                line: tokenizer.loc.end.line,
                column: tokenizer.loc.end.column,
                offset: tokenizer.loc.end.offset,
              }
              if (curr.loc.source) {
                curr.loc.source = code.slice(curr.range[0], curr.range[1])
              }
            }
            if (prev) {
              current = prev as ast.ContainerElement
            } else {
              current = result
            }
            lefts = lefts.slice(0, i)
            break
          }
          if (prev) {
            let tokenizer = curr as LeftBlockTokenizer
            // replace tokenizer
            lefts[i] = {
              type: 'TextNode',
              content: code.slice(tokenizer.range[0], tokenizer.range[1]),
              loc: tokenizer.loc,
              range: tokenizer.range,
            } as TextNodeTokenizer
          }
        }
        break
    }
  })
  merge(code, result)
  if (!options.range) {
    clean(result)
  }
  return result
}
/**
 * 搜索满足表达式的节点
 *
 * @param root 根节点
 * @param selector 选择器表达式
 * @example querySelector():base
  ```js
  var root = cbml.parse(`
  <!~remove trigger="release">remove1</remove~>
  <!~remove trigger="debug">remove2</remove~>
  <!~remove trigger>remove3</remove~>
  <!~remove>remove4</remove~>
  `)
  console.log(cbml.querySelector(root, 'remove').loc.source)
  // > <!~remove trigger="release">remove1</remove~>
  console.log(cbml.querySelector(root, 'remove[trigger]').loc.source)
  // > <!~remove trigger="release">remove1</remove~>
  console.log(cbml.querySelector(root, 'remove[trigger="debug"]').loc.source)
  // > <!~remove trigger="debug">remove2</remove~>
  console.log(cbml.querySelector(root, 'remove*').length)
  // > 4
  console.log(cbml.querySelector(root, 'remove[trigger]*').length)
  // > 3
  console.log(cbml.querySelector(root, 'remove[trigger="debug"]*').length)
  // > 1
  ```
 * @example querySelector():coverage
  ```js
  var root = cbml.parse(`
  <!~remove trigger="release">remove1</remove~>
  <!~remove trigger="debug">remove2</remove~>
  <!~remove trigger>remove3</remove~>
  <!~remove>remove4</remove~>
  `)
  console.log(cbml.querySelector(root, 'dev'))
  // > null
  console.log(cbml.querySelector(root))
  // > null
  console.log(cbml.querySelector())
  // > null
  ```
 * @example querySelector():throw
  ```js
  var root = cbml.parse(`
  <!~remove trigger="release">remove1</remove~>
  `)
  cbml.querySelector(root, 'dev//1')
  // * throw
  ```
 */
export function querySelector(
  root: ast.ContainerElement,
  selector: string
): ast.Node | ast.Node[] {
  if (!root || !selector) {
    return null
  }
  let match = selector.match(
    /^\s*([\w_-]*)((\s*\[[\w_-]+\s*(=\s*("([^\\"]*(\\.)*)*"|'([^\\']*(\\.)*)*'|[^\[\]]*))?\])*)\s*(\*?)$/
  )
  if (!match) {
    throw `${JSON.stringify(selector)} is not a valid selector.`
  }
  let tag = match[1]
  let all = match[10] === '*'
  let attributes: { [name: string]: string } = {}
  match[2].replace(
    /\s*\[([\w_-]+)\s*(=\s*("([^\\"]*(\\.)*)*"|'([^\\']*(\\.)*)*'|[^\[\]]*))?\]/g,
    (match, name, expr, value) => {
      if (/^['"]/.test(value)) {
        /*jslint evil: true */
        value = new Function('return (' + value + ');')()
      }
      attributes[name] = value
      return ''
    }
  )
  function check(element: ast.Element): boolean {
    let result = false
    if (!tag || element.tag === tag) {
      result = Object.keys(attributes).every(name => {
        if (!element.attributes[name]) {
          return false
        }
        if (!attributes[name] && attributes[name] !== '') {
          return true
        }
        return element.attributes[name].value === attributes[name]
      })
    }
    return result
  }
  let items: ast.Element[] = []
  function scan(element: ast.Element): boolean {
    if (check(element)) {
      items.push(element)
      return true
    }
    let parent = element as ast.ContainerElement
    if (parent.body) {
      parent.body.some(item => {
        return scan(item as ast.Element) && !all
      })
    }
  }
  scan(root)
  if (all) {
    return items
  } else {
    return items[0] || null
  }
}
