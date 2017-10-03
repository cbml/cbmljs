import * as cbml from './ast';
export interface ParserOptions {
    ignoreLocation?: boolean;
    ignoreSource?: boolean;
}
export declare function parse(code: string, options?: ParserOptions): cbml.CBMLElement;
