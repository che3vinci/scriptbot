#!/usr/bin/env zx

import { run } from '@auto-scripts/cli';
import { $ } from 'zx';

run({
  async show(option) {
    const { file } = option || {};
    await $`identify ${file}`;
  },
  async convert(option) {
    const { resize, source, target } = option || {};
    if (resize) {
      await $`convert ${source} -resize ${resize} ${target}`;
      return;
    }
    await $`convert ${source} ${target}`;
  },
});
