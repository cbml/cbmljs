import * as cbml from './ast';
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
export declare function parse(code: string, options?: IParserOptions): cbml.CBMLElement;
