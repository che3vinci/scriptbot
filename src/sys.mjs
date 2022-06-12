#!/usr/bin/env zx
import { run } from '@c3/cli';
import { cd, os } from 'zx';

run({
  async clean() {
    const files = [
      'dist',
      'build',
      'node_modules',
      'package.json',
      '*.js',
      '*.lock',
    ];
    cd(os.homedir());
    await `rm -rf ${files}`;
  },
});
