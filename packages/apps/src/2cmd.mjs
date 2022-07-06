#!/usr/bin/env zx
import { resolve } from 'path';
import { getProjectDir, run } from '@auto-scripts/cli';

run({
  async install() {
    const { stdout } = await $`ls ${__dirname}`;
    for (const app of stdout) {
      const cmd = resolve(argv._[0] || '');

      //FIXME:
      const dest =
        '/Users/chevinci/.nvm/versions/node/v16.13.1/bin/' +
        cmd.match(/[^/]+$/)[0].replace(/\..*$/, '');
      await $`rm -rf ${dest}`;
      await $`ln -s ${cmd} ${dest}`;
      await $`chmod a+x ${dest}`;
    }
  },
});
