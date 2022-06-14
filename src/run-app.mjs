#!/usr/bin/env zx
import { run, replaceTextInFile } from '@c3/cli';
import { $ } from 'zx';
// replaceTextInFile('./index.tsx', 'App', 'xxx');

run({
  async react(options) {
    const file = (options.file || 'App.tsx').replace(/\..+$/, '');
    const files = ['index.html', 'index.tsx', 'vite.config.ts'];
    process.on('SIGINT', async () => {
      await $`rm ${files}`;
    });
    await $`rm -rf ${files}`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/react-vite/index.html`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/react-vite/index.tsx`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/react-vite/vite.config.ts`;
    replaceTextInFile('./index.tsx', /App/g, file);
    await $`vite --open`;
  },
});
