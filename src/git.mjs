#!/usr/bin/env zx
import { exec, getProjectDir, run } from '@c3/cli';
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
});
