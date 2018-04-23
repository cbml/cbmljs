import * as ast from 'cbml-ast';
export { ast };
export interface IParserOptions {
    /**
     * 是否获取位置信息，默认：true
     */
    loc?: boolean;
    /**
     * 是否获取源代码信息，默认：true
     */
    source?: boolean;
    /**
     * 是否获取代码范围信息，默认：false
     */
    range?: boolean;
}
/**
 * 解析代码片段包含的 CBML 元素
 *
 * @param code 代码片段
 * @param options 配置项
 * @return 返回 CBML 元素
 */
export declare function parse(code: string, options?: IParserOptions): ast.CBMLElement;
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
export declare function querySelector(root: ast.ContainerElement, selector: string): ast.Node | ast.Node[];
