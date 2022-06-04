import { os, $ } from 'zx';
import { run, createProject, Json } from '@c3/cli';
import { copyJsonField } from '@c3/cli';

run({
  async react() {
    process.on('SIGINT', async () => {
      const files = ['index.html', 'index.tsx', 'vite.config.ts'];
      await $`rm ${files}`;
    });
    try {
      await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/templates/react-vite/index.html`;
      await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/templates/react-vite/index.tsx`;
      await $`wget https://raw.githubusercontent.com/che3vinci/react-template/master/templates/react-vite/vite.config.ts`;
      await $`vite --open`;
    } catch (e) {
      console.log('xxxxx');
    }
  },
});
