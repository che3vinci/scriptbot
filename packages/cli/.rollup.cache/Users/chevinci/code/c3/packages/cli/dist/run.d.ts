export declare type IRunOption = {
    [param: string]: <T>(value: T) => Promise<void> | void;
};
export declare function run(option: IRunOption): Promise<void>;
