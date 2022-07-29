#!/usr/bin/env zx
import { exec, getProjectDir, run } from '@scriptbot/cli';
import { $, cd } from 'zx';

const project = getProjectDir();

run({
  async amend() {
    await cd(project);
    await $`git add .`;
    await exec(`git commit --amend`, [
      { regex: /Changes to be committed/g, input: ':wq\n' },
    ]);
    await $`git push --force`;
    await $`git status`;
  },
  async commit(options) {
    const { msg } = options;
    await cd(project);
    await $`git add .`;
    await $`git commit -a -m ${msg}`;
    await $`git push`;
  },
  async restore(options) {
    const { msg } = options;
    await cd(project);
    await $`git reset --hard`;
    await $`git clean -fd`;
  },
  async merge(option) {
    const { preview } = option;

    await cd(project);
    await $`pnpm up --latest "@unstyled-ui/*"`;
    await $`pnpm up --latest "@c3/*"`;
    await $`gi amend`;
    const { stdout } = await $`git branch --show-current`;
    const branchName = stdout.replace(/\n/, '');
    await $`rm -rf /tmp/client`;
    await $`git clone https://github.com/Overealityio/client /tmp/client`;
    await cd('/tmp/client');
    await $`git checkout ${branchName}`;
    await $`pnpm install && pnpm preview`;
    await $`git checkout dev`;
    await $`git merge ${branchName}`;
    if (preview) {
      await $`pnpm preview`;
    }
    await $`git push`;
  },
});
