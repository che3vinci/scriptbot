import { $, cd } from 'zx';
import { getNpx } from './getNpx';
export const projects = {
    a: async ({ projectName, npm }) => {
        await $ `${getNpx(npm)} degit fabien-ml/react-ts-vite-template ${projectName}`;
    },
    viteTs: async ({ projectName, npm }) => {
        await $ `${npm} create vite ${projectName} --template react-ts`;
    },
    bone: async ({ projectName, npm }) => {
        await $ `mkdir ${projectName}`;
        cd(projectName);
        await $ `${npm} init `;
        const pkgs = ['react', 'react-dom', 'vite', '@vitejs/plugin-react'];
        await $ `${npm} add ${pkgs}`;
    },
    cra: async ({ projectName, npm }) => {
        await $ `${getNpx(npm)} create-react-app ${projectName} --template typescript`;
    },
};
export const createProject = async (option) => {
    $.quote = e => e;
    const { projectName = 'my-app', baseDir = '/tmp', type = 'viteTs', npm = 'pnpm', before, } = option || {};
    const projectDir = `${baseDir}/${projectName}`;
    await cd(baseDir);
    await $ `rm -rf ${projectName}`;
    await projects[type].call(projects, { projectName, baseDir, type, npm });
    await cd(projectDir);
    before && (await before());
    npm === 'pnpm' && (await $ `echo 'auto-install-peers=true' >> .npmrc`);
    await $ `${npm} install`;
};
//# sourceMappingURL=createProject.js.map