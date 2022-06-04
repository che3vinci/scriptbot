#!/usr/bin/env zx
import { os, $ } from 'zx';
import { run, createProject, Json } from '@c3/cli';
import { copyJsonField } from '@c3/cli';

run({
  createProject: async para => {
    await createProject(para);
  },
  async vscode() {
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/templates/vscode/settings.json`;
    await $`cp settings.json .vscode/settings.json`;
    await $`rm settings.json`;
  },
  async typescript() { },
  async git() { },
  async jest() {
    await $`yarn add --dev jest @types/jest ts-node ts-jest`;
    // await $`jest --init`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/jest.config.ts`;
  },

  async babel() { },

  async editorconfig() {
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.editorconfig`;
    await $`yarn add  --save-dev eslint-config-prettier`;
  },
  async commitlint() {
    await $`yarn global add @commitlint/cli @commitlint/config-conventional`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.husky/commit-msg`;
    await $`cp commit-msg .husky/`;
    await $`chmod a+x .husky/commit-msg`;
    await $`rm commit-msg`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/commitlint.config.js`;
  },
  async eslint() {
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
    await $`yarn add ${pkgs} --dev`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.eslintrc.js`;
  },
  async prettier() {
    await $`yarn add --dev --exact prettier`;
    await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/.prettierrc`;
  },
  async storybook() {
    await $`npx sb@next init --builder storybook-builder-vite`;
    await $`yarn add @storybook/addon-docs -D`;
    //TODO:
    //delete  "@storybook/addon-interactions" in .story/main.js file,
  },
  async husky() {
    await $`yarn add organize-imports-cli`;
    await $`npx mrm@2 lint-staged`;
    await copyJsonField(
      {
        file: 'https://raw.githubusercontent.com/che3vinci/react-template/master/package.json',
        path: 'lint-staged',
      },
      { file: 'package.json', path: 'lint-staged' }
    );
  },
  async nextjs() {
    await $`npx create-next-app nextjs-blog --use-yarn --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"`;
  },

  async cypress() {
    await $`yarn add cypress --dev`
    // await $`npx cypress install`;
    // await $`npx cypress init`;
  }
});
