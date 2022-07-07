#!/usr/bin/env zx
import { run } from '@scriptbot/cli';

run({
  async install() {
    const map = {
      git: 'gi',
    };
    const { stdout } = await $`ls ${__dirname}`;
    for (const app of stdout.split('\n').slice(0, -1)) {
      const name = app.match(/[^/]+$/)[0].replace(/\..*$/, '');
      const dest = `${__dirname}/../bin/${map[name] || name}`;
      await $`rm -rf ${dest}`;
      await $`ln -s ${__dirname}/${app} ${dest}`;
      await $`chmod a+x ${dest}`;
    }
  },
});
