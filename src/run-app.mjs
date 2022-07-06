#!/usr/bin/env zx
import { run, replaceTextInFile } from '@c3/cli';
import { $ } from 'zx';
const template = file => path.resolve(__dirname, `../templates/${file}`);
const viteTemplate = file => template(`react-vite/${file}/`);

run({
  async react(options) {
    const file = (options.file || 'App.tsx').replace(/\..+$/, '');
    const files = ['index.html', 'index.tsx', 'vite.config.ts'];
    process.on('SIGINT', async () => {
      await $`rm ${files}`;
    });
    await $`rm -rf ${files}`;
    for(const f of files){
      await $`cp ${viteTemplate(f)} ${f}`;
    }
    replaceTextInFile('./index.tsx', /App/g, file);
    await $`vite --open`;
  },
});
