#!/usr/bin/env zx
import { os, $, cd } from 'zx';
import { run, createProject, Json, getNpx } from '@c3/cli';
import { copyJsonField } from '@c3/cli';

run({
  async createProject(para) {
    await createProject(para);
  },
  async vscode() {
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/templates/vscode/settings.json`;
    await $`mv settings.json .vscode/settings.json`;
  },
  async typescript() { },
  async git() { },
  async jest(options) {
    const { usingInit = false } = options || {};
    await $`pnpm add --save-dev jest babel-jest @babel/preset-typescript @types/jest`;
    await $`pnpm add jest-environment-jsdom`;
    if (usingInit) {
      await $`jest --init`;
    } else {
    }
  },


  async babel() {
    const pkgs = [
      '@babel/core',
      '@babel/preset-env',
      '@babel/plugin-transform-react-jsx',
    ];
    await $`pnpm add --save-dev ${pkgs} `;
  },

  async editorconfig() {
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.editorconfig`;
    await $`pnpm add  --save-dev eslint-config-prettier`;
  },
  async commitlint() {
    await $`pnpm global add @commitlint/cli @commitlint/config-conventional`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.husky/commit-msg`;
    await $`cp commit-msg .husky/`;
    await $`chmod a+x .husky/commit-msg`;
    await $`rm commit-msg`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/commitlint.config.js`;
  },
  async eslint(option) {
    const { npm = 'pnpm' } = option
    const pkgs = [
      'eslint',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
    ];
    $.quote = e => e;
    await $`${npm} add ${pkgs} --save-dev`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.eslintrc.js`;
  },
  async prettier() {
    await $`pnpm add --save-dev  prettier`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.prettierrc`;
  },
  async storybook(options) {
    const { demo = true, npm = 'pnpm' } = options;

    if (demo) {
      await this.createProject({
        projectName: 'storybook-test-1',
        type: 'viteTs',
        npm: npm,
      });
    }
    await $`echo 'shamefully-hoist=true' >> .npmrc`;
    await $`echo 'auto-install-peers=true' >> .npmrc`;
    await $`${npm} add @storybook/builder-vite --save-dev`;

    // await $`${getNpx(npm)} storybook init`;
    // const pkgs = ['sb@next', '@storybook/addon-docs'];
    // await $`pnpm install ${pkgs} --save-dev`;
    await $`${getNpx(npm)} sb init --builder @storybook/builder-vite`;
    //TODO:
    //delete  "@storybook/addon-interactions" in .story/main.js file,
  },
  async husky() {
    await $`pnpm add organize-imports-cli`;
    await $`npx mrm@2 lint-staged`;
    new Json('./package.json').set('lint-stage', {
      '*.{ts,tsx}': [
        "bash -c 'tsc  --project . --noEmit'",
        'organize-imports-cli',
        'prettier --write',
        'eslint --cache --fix',
      ],
      '*.{js,jsx}': [
        'organize-imports-cli',
        'prettier --write',
        'eslint --cache --fix',
      ],
      '*.{css,md}': 'prettier --write',
    });
  },
  async nextjs() {
    await $`npx create-next-app nextjs-blog --use-pnpm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"`;
  },

  async cypress() {
    await $`pnpm add cypress --save-dev`;
    // await $`npx cypress install`;
    // await $`npx cypress init`;
  },
  async pnpm(options) {
    const { monorepo = true, demo = true } = options || {};
    if (demo) {
      await this.createProject({ projectName: 'pnpm-test-2', type: 'bone' });
      new Json('./package.json').set('engines', {
        node: '>=10',
        pnpm: '>=3',
      });
      if (monorepo) {
        await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/templates/pnpm/pnpm-workspace.yaml`;
        await $`mkdir packages`;
        await cd('packages');
        await $`mkdir utils && mkdir client`;
        await cd('utils');
        await $`pnpm init && echo 'const add = (a, b) => a + b; module.exports ={add}' > index.js`;
        await cd('../client');
        await $`pnpm init  && echo 'const {add} =require("utils");
        console.log(add(1,3))' > index.js`;
        new Json('./package.json').set('dependencies', {
          utils: 'workspace:^',
        });
        await $`pnpm install`;
        await $`node index.js`;

        await this.changeset();
      }
    }
  },
  async changeset() {
    await cd('../../');
    await $`pnpm add -Dw @changesets/cli`;
    await $`pnpm changeset init`;
    console.log('make sure git repo is inited');
    await $`pnpm changeset add`;
  },
  async lerna() {
    await createProject({ projectName: 'lerna-test-1', type: 'bone' });
    await $`lerna init --independent`;
    await $`lerna create @bullmind/colors --es-module -y`;
    await $`lerna create @bullmind/cli --es-module -y`;
  },
});
