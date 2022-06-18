#!/usr/bin/env zx
import { os, $, cd } from 'zx';
import { run, createProject, Json, getNpx, getProjectDir } from '@c3/cli';
import path from 'path';

run({
  async createProject(para) {
    await createProject(para);
  },
  async vscode() {
    await $`cp ${path.resolve(
      __dirname,
      '../templates/vscode/settings.json'
    )} ${getProjectDir()}/.vscode/settings.json`;
  },
  async typescript() {},
  async git() {},

  /**
   * support wallaby
   * @param {*} options
   */
  async jest(options) {
    const { react } = options || {};
    const pkgs = [
      'jest',
      'babel-jest',
      '@babel/preset-env',
      '@babel/preset-typescript',
      'jest-environment-jsdom',
      '@types/jest',
    ].concat(['lodash', '@types/lodash']);
    await $`pnpm add --save-dev ${pkgs}`;
    new Json('package.json')
      .set('jest', {
        transformIgnorePatterns: [],
        testEnvironment: 'jsdom',
      })
      .set('babel', {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
      });

    await $`rm -rf test && mkdir test`;
    await $`cp ${path.resolve(
      __dirname,
      '../templates/jest/add.test.ts'
    )} test/ `;

    if (react) {
      const pkgs = [
        '@babel/preset-react', // transform jsx syntax to react.createElement
        'react',
        'react-dom',
        '@types/react',
        '@types/react-dom',
      ].concat(['@testing-library/react', '@testing-library/jest-dom']);
      await $`pnpm add --save-dev ${pkgs}`;
      new Json('package.json').append('babel.presets', '@babel/preset-react');
      await $`cp ${path.resolve(
        __dirname,
        '../templates/jest/Counter.test.tsx'
      )} test/ `;
      await $`cp ${path.resolve(
        __dirname,
        '../templates/jest/Counter.tsx'
      )} test/ `;
    }

    await $`jest`;
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
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/.editorconfig`;
    await $`pnpm add  --save-dev eslint-config-prettier`;
  },
  async commitlint() {
    await $`pnpm global add @commitlint/cli @commitlint/config-conventional`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/.husky/commit-msg`;
    await $`cp commit-msg .husky/`;
    await $`chmod a+x .husky/commit-msg`;
    await $`rm commit-msg`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/commitlint.config.js`;
  },
  async eslint(option) {
    const { npm = 'pnpm' } = option;
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
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/.eslintrc.js`;
  },
  async prettier() {
    await $`pnpm add --save-dev  prettier`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/.prettierrc`;
  },
  async storybook(options) {
    const { demo = true, npm = 'pnpm' } = options;

    if (demo) {
      await this.createProject({
        projectName: 'storybook-test-1',
        type: 'viteTs',
        npm: npm,
        before: async () => {
          await $`echo 'shamefully-hoist=true' >> .npmrc`;
          await $`echo 'auto-install-peers=true' >> .npmrc`;
        },
      });
    } else {
      await $`echo 'shamefully-hoist=true' >> .npmrc`;
      await $`echo 'auto-install-peers=true' >> .npmrc`;
    }
    await $`${getNpx(npm)} storybook init`;
    await $`${npm} storybook`;
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
    const { monorepo = true, create } = options || {};
    new Json('./package.json').set('engines', {
      node: '>=10',
      pnpm: '>=3',
    });
    if (create) {
      await this.createProject({ projectName: 'pnpm-test-2', type: 'bone' });

      if (monorepo) {
        await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/pnpm/pnpm-workspace.yaml`;
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
    if (monorepo) {
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
  async playwright(option) {
    const { install, create } = option;
    if (create) {
      this.createProject({ projectName: 'playwright-test-1', type: 'bone' });
    }
    if (install) {
      await $`pnpm add  @playwright/test`;
    }
  },
});
