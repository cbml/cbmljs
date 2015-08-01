(function (exportName) {
  'use strict';
  /* global exports */
  var exports = exports || {};
  /**
   * @file cbml
   *
   * CBML Parser
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.0.8
   * @date 2015-08-01
   */
  var htmlDecodeDict = {
    'quot': '"',
    'lt': '<',
    'gt': '>',
    'amp': '&',
    'nbsp': ' '
  };
  /**
   * HTML 解码
   *
   * @param {string} html 输入
   * @return {string} 返回解码后的字符串
   */
  function decodeHTML(html) {
    return String(html).replace(
      /&((quot|lt|gt|amp|nbsp)|#x([a-f\d]+)|#(\d+));/ig,
      function (all, group, key, hex, dec) {
        return key ? htmlDecodeDict[key.toLowerCase()] :
          hex ? String.fromCharCode(parseInt(hex, 16)) :
          String.fromCharCode(parseInt(dec, 10));
      }
    );
  }
  /**
   * 突出显示错误的代码行
   *
   * @param {Array} buffer 从开始位置到错误位置的代码行
   * @param {number} count 样本行数
   */
  function lightcode(buffer, count) {
    var len = buffer.length.toString().length;
    var lines = buffer.slice(-(count || 5));
    for (var i = lines.length - 1; i >= 0; i--) {
      var l = (buffer.length + i - lines.length + 1).toString();
      l = (new Array(len - l.length + 1)).join(' ') + l; // 前面补空格
      lines[i] = l + (i === lines.length - 1 ? ' > ' : '   ') + '| ' + lines[i];
    }
    console.log(lines.join('\n'));
  }
  /**
   * CBML 语法元素抽取
   *
   * @param {string} code 代码文本
   * @param {Object} options 配置项
   * @return {Array} 返回处理后语法数组
   */
  function tokenizer(code, options) {
    options = options || {};
    /**
     * 语法块
     *
     * ```js
     * {
     *   type: 'text', // 类型 text, right, left, single, comment
     *   tag: 'jshint', // 提示
     *   attrs: 'file="1.js"', // 属性
     *   language: 'none', // 语言 pascal, xml, c, python
     *   value: 'text', // 内容
     *   line: 1, // 行数
     *   col: 12, // 列数
     *   pos: 100, // 起始位置
     *   endpos: 102 // 结束位置
     * }
     * ```
     * @type {Array}
     */
    var tokens = [];
    function pushToken(type, pos, endpos, data) {
      if (endpos <= pos) {
        return;
      }
      var value = code.slice(pos, endpos);
      var token = {
        type: type,
        pos: pos,
        endpos: endpos,
        value: value
      };
      data = data || {};
      for (var key in data) {
        token[key] = data[key];
      }
      if (!options.ignoreLine) {
        var buffer = code.slice(0, pos).split('\n');
        token.line = buffer.length;
        token.col = buffer[buffer.length - 1].length + 1;
        buffer = null;
      }
      S.pos = endpos;
      tokens.push(token);
    }
    var S = { // 扫描的信息
      text: code,
      pos: 0 // 扫描位置
    };
    while (S.pos < S.text.length) {
      // find tagName // 「《！--jdists」--》
      var match = S.text.substring(S.pos).match(
        /(<!--|\/\*<|\(\*<|'''<|--\[\[<)(\/?)([\w_]+[\w_-]*[\w_]|[\w_]+)\s*|(<\/)([\w_]+[\w_-]*[\w_]|[\w_]+)(>\*\/|>\*\)|>'''|>\]\]|-->)/
      );
      if (!match) {
        break;
      }
      pushToken('text', S.pos, S.pos + match.index); // 记录 text
      var tag = match[3];
      var attrs = {};
      var offset = match[0].length;
      var language;
      var find; // find end
      if (!tag) {
        tag = match[5];
        switch (match[6]) {
        case '-->':
          language = 'xml';
          break;
        case '>*/':
          language = 'c';
          break;
        case '>*)':
          language = 'pascal';
          break;
        case ">'''":
          language = 'python';
          break;
        case ">]]":
          language = 'lua';
          break;
        }
        pushToken('right', S.pos, S.pos + offset, {
          comment: true,
          tag: tag,
          language: language
        });
        continue;
      }
      switch (match[1]) {
      case '<!--':
        find = /^\s*(\/?-->)/;
        language = 'xml';
        break;
      case '/*<':
        find = /^\s*(\/?>\*\/)/;
        language = 'c';
        break;
      case '(*<':
        find = /^\s*(\/?>\*\))/;
        language = 'pascal';
        break;
      case "'''<":
        find = /^\s*(\/?>''')/;
        language = 'python';
        break;
      case "--[[<":
        find = /^\s*(\/?>\]\])/;
        language = 'lua';
        break;
      }
      var buffer;
      var line;
      var col;
      var error;
      if (match[2] === '/') { // 闭合便签 // 《！--「/」jdists--》
        match = S.text.substring(S.pos + offset).match( // 《！--/jdists「--》」
          find
        );
        if (!match) {
          buffer = code.slice(0, S.pos + offset).split('\n');
          line = buffer.length;
          col = buffer[buffer.length - 1].length + 1;
          lightcode(buffer, 5);
          error = 'Uncaught SyntaxError: Can\'t match "' + find + '". (line:' + line + ' col:' + col + ')';
          console.error(error);
          throw error;
        }
        offset += match[0].length;
        pushToken('right', S.pos, S.pos + offset, {
          tag: tag,
          language: language
        });
      }
      else { // 属性 // 《！--/jdists「file="1.js" clean」--》」
        // find attrs
        while (true) {
          // find attrName
          match = S.text.substring(S.pos + offset).match(
            /^\s*([\w_]+[\w_-]*[\w_]|[\w_]+)\s*/
          );
          if (!match) {
            break;
          }
          offset += match[0].length;
          var attrName = match[1];
          var attrValue = '';
          // find attrValue
          match = S.text.substring(S.pos + offset).match(
            /^\s*=\s*('([^']*)'|"([^"]*)"|([^'"\s\/>]+))\s*/
          );
          if (match) {
            offset += match[0].length;
            attrValue = match[1];
          }
          switch (attrValue[0]) {
          case '"':
          case "'":
            attrValue = attrValue.slice(1, -1);
            break;
          }
          attrs[attrName] = decodeHTML(attrValue);
        }
        switch (language) {
        case 'xml':
          find = /^\s*(\/?-->|>)/;
          break;
        case 'c':
          find = /^\s*(\/?>\*\/|>)/;
          break;
        case 'pascal':
          find = /^\s*(\/?>\*\)|>)/;
          break;
        case "python":
          find = /^\s*(\/?>'''|>)/;
          break;
        case 'lua':
          find = /^\s*(\/?>\]\]|>)/;
          break;
        }
        match = S.text.substring(S.pos + offset).match(
          find
        );
        if (!match) {
          buffer = code.slice(0, S.pos + offset).split('\n');
          line = buffer.length;
          col = buffer[buffer.length - 1].length + 1;
          lightcode(buffer, 5);
          error = 'Uncaught SyntaxError: Can\'t match "' + find + '". (line:' + line + ' col:' + col + ')';
          console.error(error);
          throw error;
        }
        offset += match[0].length;
        if (match[1] === '>') { // 需要闭合 // 《！--/jdists》...《/jdists--》」
          pushToken('left',
            S.pos,
            S.pos + offset, {
              comment: true,
              tag: tag,
              language: language,
              attrs: attrs
            }
          );
        }
        else {
          pushToken(match[1][0] === '/' ? 'single' : 'left',
            S.pos,
            S.pos + offset, {
              tag: tag,
              language: language,
              attrs: attrs
            }
          );
        }
      }
    }
    pushToken('text', S.pos, S.text.length); // 记录 text
    return tokens;
  }
  exports.tokenizer = tokenizer;
  function nodesContent(nodes) {
    var result = '';
    if (nodes) {
      nodes.forEach(function (node) {
        return result += node.value;
      });
    }
    return result;
  }
  /**
   * CBML 解析
   *
   * @param {string} code 代码文本
   * @param {Object} options 配置项
   * @return {Object} 返回处理后语法树
   */
  function parse(code, options) {
    if (!code) {
      return;
    }
    code = String(code).replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
      .replace(/^\uFEFF/, ''); // 数据清洗
    var root = {
      type: 'cbml',
      nodes: []
    };
    var current = root;
    var tokens = tokenizer(code, options);
    var lefts = []; // 左边标签集合，用于寻找配对的右边标签
    tokens.forEach(function (token) {
      switch (token.type) {
      case 'single':
      case 'text':
        current.nodes.push(token);
        if (root !== current) {
          current.value += token.value;
        }
        current.endpos = token.endpos;
        break;
      case 'left':
        token.nodes = [];
        lefts.push(token);
        current.nodes.push(token);
        current = token;
        break;
      case 'right':
        var buffer;
        var line;
        var col;
        var error;
        if (lefts.length <= 0) {
          buffer = code.slice(0, token.endpos).split('\n');
          line = buffer.length;
          col = buffer[buffer.length - 1].length + 1;
          lightcode(buffer, 5);
          error = 'No start tag. (line:' + token.line + ' col:' + token.col + ')';
          console.error(error);
          throw error;
        }
        for (var i = lefts.length - 1; i >= 0; i--) {
          var curr = lefts[i];
          var prev = lefts[i - 1];
          if (curr.tag === token.tag &&
            curr.language === token.language &&
            curr.comment === token.comment) {
            curr.type = 'block';
            curr.value += token.value;
            curr.endpos = token.endpos;
            curr.content = nodesContent(curr.nodes);
            if (prev) {
              current = prev;
              current.value += curr.value;
            }
            else {
              current = root;
            }
            current.endpos = curr.endpos;
            // 计算前缀和后缀
            if (curr.nodes && curr.nodes.length) {
              var begin = curr.nodes[0];
              var end = curr.nodes[curr.nodes.length - 1];
              curr.prefix = curr.value.slice(0, begin.pos - curr.pos);
              curr.suffix = curr.value.slice(-(curr.endpos - end.endpos));
            }
            lefts = lefts.slice(0, i);
            break;
          }
          else { // 不匹配的开始。。。
            if (!prev) {
              buffer = code.slice(0, token.endpos).split('\n');
              line = buffer.length;
              col = buffer[buffer.length - 1].length + 1;
              lightcode(buffer, 5);
              error = 'No start tag. (line:' + token.line + ' col:' + token.col + ')';
              console.error(error);
              throw error;
            }
            curr.type = 'text';
            delete curr.nodes; // 移除子节点
            delete curr.tag;
            delete curr.attrs;
            delete curr.language;
            prev.value += curr.value;
            prev.endpos = curr.endpos;
          }
        }
        break;
      }
    });
    for (var i = lefts.length - 1; i >= 0; i--) {
      var curr = lefts[i];
      curr.type = 'text';
      delete curr.nodes; // 移除子节点
      delete curr.tag;
      delete curr.attrs;
      delete curr.language;
      var prev = lefts[i - 1];
      if (prev) {
        prev.value += curr.value;
      }
      else {
        prev = root;
      }
      prev.endpos = curr.endpos;
    }
    return root;
  }
  exports.parse = parse;
  /* global define,module,window */
  /* exported exports */
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function () {
        return exports;
      });
    }
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }
  else {
    window[exportName] = exports;
  }
})('cbml');