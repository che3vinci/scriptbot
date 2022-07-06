import type { PropertyPath } from 'lodash';
export declare class Json {
    private _data;
    private _file;
    constructor(file: string);
    set(path: PropertyPath, value: unknown): this;
    /**
     * jest:{
     *  a:1
     * }
     * @param path
     * @param value
     */
    append(path: PropertyPath, value: unknown): void;
    get(path: PropertyPath): any;
    save(): this;
    get file(): string;
    get data(): object;
}
interface JSONField {
    file: string;
    path: PropertyPath;
}
export declare const copyJsonField: (src: JSONField, desc: JSONField) => Promise<void>;
export {};
