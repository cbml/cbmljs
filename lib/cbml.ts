import * as cbml from './ast'
export interface ParserOptions {
  ignoreLocation?: boolean
  ignoreSource?: boolean
}
// 临时语法元素
interface IPosNodeTokenizer extends cbml.Node {
  startPos?: number
  endPos?: number
}
interface IPosElementTokenizer extends IPosNodeTokenizer, cbml.Element {}
interface TextNodeTokenizer extends cbml.TextNode, IPosNodeTokenizer {
  type: 'TextNode'
}
interface LeftBlockTokenizer extends cbml.ContainerElement, IPosNodeTokenizer {
  type: 'LeftBlockTokenizer'
}
interface LeftCommentTokenizer extends cbml.ContainerElement, IPosNodeTokenizer {
  type: 'LeftCommentTokenizer'
}
interface RightBlockTokenizer extends cbml.ContainerElement, IPosNodeTokenizer {
  type: 'RightBlockTokenizer'
}
interface RightCommentTokenizer extends cbml.ContainerElement, IPosNodeTokenizer {
  type: 'RightCommentTokenizer'
}
/**
 * @file cbml
 *
 * CBML Parser
 * @author
  *   zswang (http://weibo.com/zswang)
  * @version 1.0.0-alpha.4
  * @date 2017-10-04
  */
const htmlDecodeDict = {
  'quot': '"',
  'lt': '<',
  'gt': '>',
  'amp': '&',
  'nbsp': '\xa0',
}
function decodeHTML(html: string): string {
  return html.replace(
    /&((quot|lt|gt|amp|nbsp)|#x([a-f\d]+)|#(\d+));/ig,
    (all, group, key, hex, dec) => {
      return key ? htmlDecodeDict[key.toLowerCase()] :
        hex ? String.fromCharCode(parseInt(hex, 16)) :
          String.fromCharCode(dec)
    }
  )
}
function calcPosition(code: string, pos: number): cbml.Position {
  let buffer = code.slice(0, pos).split('\n')
  return {
    line: buffer.length,
    column: buffer[buffer.length - 1].length + 1,
  }
}
function calcLocation(code: string, start: number, end: number, ignoreSource: boolean): cbml.SourceLocation {
  return {
    source: ignoreSource ? null : code.slice(start, end),
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
  }
}
function calcLanguage(text: string): cbml.Language {
  let result
  Object.keys(LanguageMap).some((key) => {
    let language = LanguageMap[key]
    if (language.pattern.indexOf(text) >= 0) {
      result = key
      return true
    }
  })
  return result
}
interface ScanNode {
  (token: cbml.Node)
}
function tokenizer(code: string, options: ParserOptions, scan: ScanNode) {
  let start = 0
  let end = 0
  function append(node: cbml.Node) {
    if (options.ignoreLocation) {
      node.loc = null
    } else {
      node.loc = calcLocation(code, start, end, options.ignoreSource)
    }
    node['startPos'] = start
    node['endPos'] = end
    scan(node)
    start = end
  }
  while (start < code.length) {
    let match = code.slice(start).match(
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
    if (match[2] === '/') { // 闭合便签 // 《！--「/」jdists--》
      let find = LanguageMap[language].closed
      match = code.slice(end).match(find) // 《！--/jdists「--》」
      if (!match) {
        let pos = calcPosition(code, end)
        throw `Uncaught SyntaxError: Can't match ${find}. (line: ${pos.line}, col: ${pos.column})`
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
    let attributes: cbml.Attribute[] = []
    while (true) {
      // find attrName
      match = code.slice(end).match(/^\s*([\w_]+[\w_-]*[\w_]|[\w_]+)\s*/)
      if (!match) {
        break
      }
      end += match[0].length
      let attribute: cbml.Attribute = {
        name: match[1],
        value: '',
        quoted: '',
      }
      let value = ''
      // find attrValue
      match = code.slice(end).match(/^\s*=\s*('([^']*)'|"([^"]*)"|([^'"\s\/>]+))\s*/)
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
      attributes.push(attribute)
    }
    let find = LanguageMap[language].closed2
    match = code.slice(end).match(find)
    if (!match) {
      if (language === 'xml') { // xml 则宽松一些 // <!~1. line<br>~>
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
      if (language === 'c') { // jsx
        if (attributes.some((attribute) => {
          return attribute.quoted === '' && /^\s*\{/.test(attribute.value)
        })) {
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
      throw `Uncaught SyntaxError: Can't match ${find}. (line: ${pos.line}, col: ${pos.column})`
    }
    end += match[0].length
    let element: cbml.Element
    if (match[1] === '>') { // 需要闭合 // 《！--/jdists》...《/jdists--》」
      element = {
        type: 'LeftCommentTokenizer',
        attributes: attributes,
        tag: tag,
        language: language,
        body: [],
      } as LeftCommentTokenizer
    }
    else if (match[1][0] === '/') {
      element = {
        type: 'VoidElement',
        attributes: attributes,
        tag: tag,
        language: language,
      } as cbml.VoidElement
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
function merge(code: string, parent: cbml.ContainerElement) {
  if (!parent || !parent.body) {
    return
  }
  for (let i = parent.body.length - 1; i >= 0; i--) {
    let node = parent.body[i]
    let container = node as cbml.ContainerElement
    merge(code, container)
    if (['LeftBlockTokenizer', 'LeftCommentTokenizer'].indexOf(node.type) >= 0) {
      let token = node as LeftBlockTokenizer
      let TextNode: TextNodeTokenizer = {
        type: 'TextNode',
        loc: node.loc,
        content: code.slice(token.startPos, token.endPos),
        startPos: token.startPos,
        endPos: token.endPos,
      }
      node = parent.body[i] = TextNode
      let firstChild = token.body[0]
      if (firstChild) {
        let lastChild = token.body[token.body.length - 1]
        if (node.loc) {
          node.loc.end = {
            line: firstChild.loc.start.line,
            column: firstChild.loc.start.column,
          }
        }
        let params = [i + 1, 0]
        params.push.apply(params, token.body)
        params.splice.apply(parent.body, params)
      }
    }
    let nextNode = parent.body[i + 1] as TextNodeTokenizer
    if (nextNode && node.type === 'TextNode' && nextNode.type === 'TextNode') { // 合并文本
      let t = node as TextNodeTokenizer
      nextNode.startPos = t.startPos
      if (nextNode.loc) {
        nextNode.loc.start = {
          line: node.loc.start.line,
          column: node.loc.start.column,
        }
        if (nextNode.loc.source) {
          nextNode.loc.source = code.slice(nextNode.startPos, nextNode.endPos)
        }
      }
      nextNode.content = code.slice(nextNode.startPos, nextNode.endPos)
      parent.body.splice(i, 1)
    }
  }
}
function clean(parent: cbml.ContainerElement) {
  delete parent['startPos']
  delete parent['endPos']
  if (!parent.body) {
    return
  }
  parent.body.forEach((node) => {
    clean(node as cbml.ContainerElement)
  })
}
export function parse(code: string, options?: ParserOptions): cbml.CBMLElement {
  if (code === null || code === undefined) {
    return null
  }
  options = options || {}
  code = String(code)
  let loc: cbml.SourceLocation = options.ignoreLocation ? null : calcLocation(code, 0, code.length, options.ignoreSource)
  let result: cbml.CBMLElement = {
    language: 'cbml',
    tag: '#cbml',
    attributes: [],
    type: 'CBMLElement',
    body: [],
    loc: loc,
  }
  if (!code) {
    return result
  }
  let lefts: cbml.Node[] = [] // 左边标签集合，用于寻找配对的右边标签
  let current: cbml.ContainerElement = result // 当前容器
  tokenizer(code, options, (token: cbml.Node) => {
    switch (token.type) {
      case 'VoidElement':
      case 'TextNode':
        current.body.push(token)
        current['endPos'] = token['endPos']
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
          let curr = lefts[i] as IPosElementTokenizer
          let prev = lefts[i - 1]
          if (!curr) {
            throw `No start tag. (${tokenizer.tag})`
          }
          if (curr.tag == tokenizer.tag && curr.language == tokenizer.language &&
            curr.type.slice('Left'.length) === token.type.slice('Right'.length)) {
            // 匹配
            if (token.type === 'RightBlockTokenizer') {
              curr.type = 'BlockElement'
            } else {
              curr.type = 'CommentElement'
            }
            curr.endPos = tokenizer.endPos
            if (curr.loc) {
              curr.loc.end = {
                line: tokenizer.loc.end.line,
                column: tokenizer.loc.end.column,
              }
              if (curr.loc.source) {
                curr.loc.source = code.slice(curr.startPos, curr.endPos)
              }
            }
            if (prev) {
              current = prev as cbml.ContainerElement
            }
            else {
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
              content: code.slice(tokenizer.startPos, tokenizer.endPos),
              loc: tokenizer.loc,
              startPos: tokenizer.startPos,
              endPos: tokenizer.endPos,
            } as TextNodeTokenizer
          }
        }
        break
    }
  })
  merge(code, result)
  clean(result)
  return result
}