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
  async db() {
    await $`pnpm add @adonisjs/lucid`;
    await $`node ace configure @adonisjs/lucid`; //phc-bcrypt, @adonisjs/redis
  },
  async redis() {
    await $`pnpm add @adonisjs/redis`;
    await $`node ace configure @adonisjs/redis`;
  },
  async auth() {
    await $`pnpm add @adonisjs/auth`;
    await exec(`node ace configure @adonisjs/auth`, [
      { regex: /Changes to be committed/g, input: ':wq\n' },
    ]);
    // await $`node ace configure @adonisjs/auth`;
  },
});
