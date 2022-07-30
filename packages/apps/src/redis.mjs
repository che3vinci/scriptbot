#!/usr/bin/env zx
import { $, fs, which } from 'zx';
import {
  createProject,
  getProjectDir,
  Json,
  run,
  chromeApp,
} from '@scriptbot/cli';

run({
  async restart() {
    await $`brew services restart redis`;
  },
});
