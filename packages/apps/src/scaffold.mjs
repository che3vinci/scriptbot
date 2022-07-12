#!/usr/bin/env zx
import { os, $, cd } from 'zx';
import {
  run,
  createProject,
  Json,
  getNpx,
  getProjectDir,
} from '@scriptbot/cli';
import path from 'path';
const template = file => path.resolve(__dirname, `../templates/${file}`);

run({
  async createProject(options) {
    const project = await createProject(options);
    await $`code ${project}`;
  },
  async vscode() {
    await $`cp ${template(
      'vscode/settings.json'
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
    await $`cp ${template('jest/add.test.ts')} test/ `;

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
      await $`cp ${template('jest/Counter.test.tsx')} test/ `;
      await $`cp ${template('jest/Counter.tsx')} test/ `;
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

  async eslint(option) {
    const { npm = 'pnpm' } = option || {};
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
    const { projectName = 'storybook-test-1', npm = 'pnpm' } = options;

    if (projectName) {
      await createProject({
        projectName,
        type: 'viteTs',
        npm: npm,
        before: async () => {
          await $`echo 'shamefully-hoist=true' >> .npmrc`;
          await $`echo 'auto-install-peers=true' >> .npmrc`;
          await $`echo '"strict-peer-dependencies=false"' >> .npmrc`;
        },
      });
    } else {
      await $`echo 'shamefully-hoist=true' >> .npmrc`;
      await $`echo 'auto-install-peers=true' >> .npmrc`;
      // await $`echo '"strict-peer-dependencies=false"' >> .npmrc`;
    }
    await $`sb init -s `;
    await $`pnpm install`;
    await $`pnpm storybook`;
  },
  async husky(option) {
    const {
      projectName,
      commitlint = true,
      lintStage = true,
      prettier = false,
      eslint = false,
    } = option || {};
    if (projectName) {
      await createProject({ projectName, type: 'bone' });
      await $`git init`;
      await $`echo node_modules/ > .gitignore`;
      prettier && (await this.prettier());
      eslint && (await this.eslint());
    }
    const pkgs = ['husky'];
    await $`pnpm add ${pkgs} -D`;
    await $`npm set-script prepare "husky install"`;
    await $`pnpm npm run prepare`;

    if (lintStage) {
      const pkgs = ['lint-staged', 'organize-imports-cli'];

      await $`pnpm add ${pkgs} -D`;
      await $`pnpx husky add .husky/pre-commit "lint-staged"`;

      new Json('./package.json').set('lint-staged', {
        '*.{ts,tsx}': [
          "bash -c 'tsc  --project . --noEmit'",
          'organize-imports-cli',
          // prettier && 'prettier --write',
          // eslint && 'eslint --cache --fix',
        ],
        '*.{js,jsx}': [
          'organize-imports-cli',
          // prettier && 'prettier --write',
          // eslint && 'eslint --cache --fix',
        ],
        '*.{css,md}': 'prettier --write',
      });
    }

    if (commitlint) {
      const pkgs = ['@commitlint/cli', '@commitlint/config-conventional'];
      await $`pnpm  add ${pkgs}  -g`;
      await $`echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`;
      await $`pnpx husky add .husky/commit-msg 'commitlint --edit $1'`;
    }

    //try
    await $`git add  . && git commit -m "init"`;
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
      await createProject({ projectName: 'pnpm-test-2', type: 'bone' });

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
      await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/pnpm/pnpm-workspace.yaml`;
      await $`mkdir packages`;
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
    const { install, create, suportComponentTest = true } = option;
    if (create) {
      await createProject({
        projectName: 'playwright-test-1',
        npm: 'npm',
      });
    }
    if (install) {
      await $`npm add  @playwright/test`;
    }
    if (suportComponentTest) {
      await $`npm init playwright@latest -- --ct`;
    }
  },
  async fuck(option) {
    const { projectName } = option;
    const path = os.homedir() + '/' + projectName;
    await $`mkdir ${path}`;
    await cd(path);

    await $`git clone https://github.com/Overealityio/wormhole`;
    await cd('wormhole');
    await $`git pull`;
    await $`git checkout zkbridge`;
    await $`npm ci --prefix sdk/js`;
    await $`npm ci --prefix bridge_ui`;
    await $`npm install --prefix bridge_ui  ./sdk/js`;

    await cd('bridge_ui');

    await $`REACT_APP_CLUSTER=testnet  REACT_APP_COVALENT_API_KEY=ckey_b4c4f5e6010c434aad864430298 npm run start`;
    //0xC4a6623e1D75EFDa12Cb42AADc3B05A50DcBd269
  },
  async test(option) {
    const { process, meta } = option;
    process && console.log(process.env);
    meta && console.log(import.meta);
  },
});
