declare type ProjectOption = Required<Omit<IOption, 'before'>>;
export declare const projects: {
    a: ({ projectName, npm }: ProjectOption) => Promise<void>;
    viteTs: ({ projectName, npm }: ProjectOption) => Promise<void>;
    bone: ({ projectName, npm }: ProjectOption) => Promise<void>;
    cra: ({ projectName, npm }: ProjectOption) => Promise<void>;
    egg: ({ projectName, npm }: ProjectOption) => Promise<void>;
};
interface IOption {
    projectName?: string;
    baseDir?: string;
    type?: keyof typeof projects;
    npm?: 'npm' | 'pnpm' | 'yarn';
    before?: () => Promise<void>;
}
export declare const createProject: (option?: IOption) => Promise<string>;
export {};
