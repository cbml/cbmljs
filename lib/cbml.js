(function (root, factory) {
    /* istanbul ignore next */
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    } else { factory(null, root["cbml"] = {}); }
})(this, function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @file cbml
     *
     * CBML Parser
     * @author
      *   zswang (http://weibo.com/zswang)
      * @version 1.0.0-alpha.12
      * @date 2017-10-07
      */
    var htmlDecodeDict = {
        'quot': '"',
        'lt': '<',
        'gt': '>',
        'amp': '&',
        'nbsp': '\xa0',
    };
    function decodeHTML(html) {
        return html.replace(/&((quot|lt|gt|amp|nbsp)|#x([a-f\d]+)|#(\d+));/ig, function (all, group, key, hex, dec) {
            return key ? htmlDecodeDict[key.toLowerCase()] :
                hex ? String.fromCharCode(parseInt(hex, 16)) :
                    String.fromCharCode(dec);
        });
    }
    function calcPosition(code, pos) {
        var buffer = code.slice(0, pos).split('\n');
        return {
            line: buffer.length,
            column: buffer[buffer.length - 1].length + 1,
        };
    }
    function calcLocation(code, start, end, source) {
        return {
            source: source ? code.slice(start, end) : null,
            start: calcPosition(code, start),
            end: calcPosition(code, end),
        };
    }
    /**
     * 支持的语言形式
     */
    var LanguageMap = {
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
    };
    function calcLanguage(text) {
        var result;
        Object.keys(LanguageMap).some(function (key) {
            var language = LanguageMap[key];
            if (language.pattern.indexOf(text) >= 0) {
                result = key;
                return true;
            }
        });
        return result;
    }
    function tokenizer(code, options, scan) {
        var start = 0;
        var end = 0;
        function append(node) {
            if (!options.loc) {
                node.loc = null;
            }
            else {
                node.loc = calcLocation(code, start, end, options.source);
            }
            node.range = [start, end];
            scan(node);
            start = end;
        }
        while (start < code.length) {
            var match = code.slice(start).match(/(<!--|\/\*<|\(\*<|'''<|--\[\[<)(\/?)([\w_]+[\w_-]*[\w_]|[\w_]+)\s*|(<\/)([\w_]+[\w_-]*[\w_]|[\w_]+)(>\*\/|>\*\)|>'''|>\]\]|-->)/);
            // 没有 CBML 元素
            end = match ? start + match.index : code.length;
            if (end > start) {
                append({
                    type: 'TextNode',
                    content: code.slice(start, end),
                    loc: null,
                });
            }
            if (!match) {
                break;
            }
            var tag = match[3];
            end += match[0].length;
            if (!tag) {
                // 右边闭合
                tag = match[5];
                append({
                    type: 'RightCommentTokenizer',
                    attributes: null,
                    tag: tag,
                    language: calcLanguage(match[6]),
                });
                continue;
            }
            var language = calcLanguage(match[1]);
            if (match[2] === '/') {
                var find_1 = LanguageMap[language].closed;
                match = code.slice(end).match(find_1); // 《！--/jdists「--》」
                if (!match) {
                    var pos = calcPosition(code, end);
                    throw "Uncaught SyntaxError: Can't match " + find_1 + ". (line: " + pos.line + ", col: " + pos.column + ")";
                }
                end += match[0].length;
                append({
                    type: 'RightBlockTokenizer',
                    attributes: null,
                    tag: tag,
                    language: language,
                });
                continue;
            }
            // 属性 // 《！--/jdists「file="1.js" clean」--》」
            // find attrs
            var attributes = [];
            while (true) {
                // find attrName
                match = code.slice(end).match(/^\s*([\w_]+[\w_-]*[\w_]|[\w_]+)\s*/);
                if (!match) {
                    break;
                }
                end += match[0].length;
                var attribute = {
                    name: match[1],
                    value: '',
                    quoted: '',
                };
                var value = '';
                // find attrValue
                match = code.slice(end).match(/^\s*=\s*('([^']*)'|"([^"]*)"|([^'"\s\/>]+))\s*/);
                if (match) {
                    end += match[0].length;
                    value = match[1];
                }
                switch (value[0]) {
                    case '"':
                    case "'":
                        attribute.quoted = value[0];
                        value = value.slice(1, -1);
                        break;
                }
                attribute.value = decodeHTML(value);
                attributes.push(attribute);
            }
            var find = LanguageMap[language].closed2;
            match = code.slice(end).match(find);
            if (!match) {
                if (language === 'xml') {
                    match = code.slice(end).match(/^[^]*?-->/);
                    if (match) {
                        end += match[0].length;
                    }
                    else {
                        end = code.length;
                    }
                    append({
                        type: 'TextNode',
                        content: code.slice(start, end),
                        loc: null,
                    });
                    continue;
                }
                if (language === 'c') {
                    if (attributes.some(function (attribute) {
                        return attribute.quoted === '' && /^\s*\{/.test(attribute.value);
                    })) {
                        match = code.slice(end).match(/^[^]*?>\*\//);
                        if (match) {
                            end += match[0].length;
                        }
                        else {
                            end = code.length;
                        }
                        append({
                            type: 'TextNode',
                            content: code.slice(start, end),
                            loc: null,
                        });
                        continue;
                    }
                }
                var pos = calcPosition(code, end);
                throw "Uncaught SyntaxError: Can't match " + find + ". (line: " + pos.line + ", col: " + pos.column + ")";
            }
            end += match[0].length;
            var element = void 0;
            if (match[1] === '>') {
                element = {
                    type: 'LeftCommentTokenizer',
                    attributes: attributes,
                    tag: tag,
                    language: language,
                    body: [],
                };
            }
            else if (match[1][0] === '/') {
                element = {
                    type: 'VoidElement',
                    attributes: attributes,
                    tag: tag,
                    language: language,
                };
            }
            else {
                element = {
                    type: 'LeftBlockTokenizer',
                    attributes: attributes,
                    tag: tag,
                    language: language,
                    body: [],
                };
            }
            append(element);
        }
    }
    /**
     * 将没有闭合的左侧标签转换成文本节点，并合并相邻的文本节点
     *
     * @param code 当前代码
     * @param body 父节点
     */
    function merge(code, parent) {
        if (!parent || !parent.body) {
            return;
        }
        for (var i = parent.body.length - 1; i >= 0; i--) {
            var node = parent.body[i];
            var container = node;
            merge(code, container);
            if (['LeftBlockTokenizer', 'LeftCommentTokenizer'].indexOf(node.type) >= 0) {
                var token = node;
                var TextNode = {
                    type: 'TextNode',
                    loc: node.loc,
                    content: code.slice(token.range[0], token.range[1]),
                    range: token.range,
                };
                node = parent.body[i] = TextNode;
                var firstChild = token.body[0];
                if (firstChild) {
                    var lastChild = token.body[token.body.length - 1];
                    if (node.loc) {
                        node.loc.end = {
                            line: firstChild.loc.start.line,
                            column: firstChild.loc.start.column,
                        };
                    }
                    var params = [i + 1, 0];
                    params.push.apply(params, token.body);
                    params.splice.apply(parent.body, params);
                }
            }
            var nextNode = parent.body[i + 1];
            if (nextNode && node.type === 'TextNode' && nextNode.type === 'TextNode') {
                var t = node;
                nextNode.range[0] = t.range[0];
                if (nextNode.loc) {
                    nextNode.loc.start = {
                        line: node.loc.start.line,
                        column: node.loc.start.column,
                    };
                    if (nextNode.loc.source) {
                        nextNode.loc.source = code.slice(nextNode.range[0], nextNode.range[1]);
                    }
                }
                nextNode.content = code.slice(nextNode.range[0], nextNode.range[1]);
                parent.body.splice(i, 1);
            }
        }
    }
    function clean(parent) {
        delete parent.range;
        if (!parent.body) {
            return;
        }
        parent.body.forEach(function (node) {
            clean(node);
        });
    }
    function parse(code, options) {
        if (code === null || code === undefined) {
            return null;
        }
        options = options || {};
        options.loc = options.loc === undefined ? true : options.loc;
        options.source = options.source === undefined ? true : options.source;
        options.range = options.range === undefined ? false : options.range;
        code = String(code);
        var loc = options.loc ? calcLocation(code, 0, code.length, options.source) : null;
        var result = {
            language: 'cbml',
            tag: '#cbml',
            attributes: [],
            type: 'CBMLElement',
            body: [],
            loc: loc,
            range: [0, code.length],
        };
        if (!code) {
            return result;
        }
        var lefts = []; // 左边标签集合，用于寻找配对的右边标签
        var current = result; // 当前容器
        tokenizer(code, options, function (token) {
            switch (token.type) {
                case 'VoidElement':
                case 'TextNode':
                    current.body.push(token);
                    current.range[1] = token.range[1];
                    break;
                case 'LeftBlockTokenizer':
                case 'LeftCommentTokenizer':
                    current.body.push(token);
                    var container = token;
                    lefts.push(container);
                    current = container;
                    break;
                case 'RightBlockTokenizer':
                case 'RightCommentTokenizer':
                    var tokenizer_1 = token;
                    for (var i = lefts.length - 1;; i--) {
                        var curr = lefts[i];
                        var prev = lefts[i - 1];
                        if (!curr) {
                            throw "No start tag. (" + tokenizer_1.tag + ")";
                        }
                        if (curr.tag == tokenizer_1.tag && curr.language == tokenizer_1.language &&
                            curr.type.slice('Left'.length) === token.type.slice('Right'.length)) {
                            // 匹配
                            if (token.type === 'RightBlockTokenizer') {
                                curr.type = 'BlockElement';
                            }
                            else {
                                curr.type = 'CommentElement';
                            }
                            curr.range[1] = tokenizer_1.range[1];
                            if (curr.loc) {
                                curr.loc.end = {
                                    line: tokenizer_1.loc.end.line,
                                    column: tokenizer_1.loc.end.column,
                                };
                                if (curr.loc.source) {
                                    curr.loc.source = code.slice(curr.range[0], curr.range[1]);
                                }
                            }
                            if (prev) {
                                current = prev;
                            }
                            else {
                                current = result;
                            }
                            lefts = lefts.slice(0, i);
                            break;
                        }
                        if (prev) {
                            var tokenizer_2 = curr;
                            // replace tokenizer
                            lefts[i] = {
                                type: 'TextNode',
                                content: code.slice(tokenizer_2.range[0], tokenizer_2.range[1]),
                                loc: tokenizer_2.loc,
                                range: tokenizer_2.range,
                            };
                        }
                    }
                    break;
            }
        });
        merge(code, result);
        if (!options.range) {
            clean(result);
        }
        return result;
    }
    exports.parse = parse;
});
