export interface IOption {
    regex: RegExp;
    input: string;
}
export declare function exec(cmd: string, inputs?: IOption[]): Promise<import("zx/core").ProcessOutput | undefined>;
