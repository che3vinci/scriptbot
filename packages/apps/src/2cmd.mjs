#!/usr/bin/env zx
import 'zx/globals';
import { resolve } from 'path';
import { getProjectDir } from '@auto-scripts/cli';

const name = argv._[1] || '';
const cmd = resolve(name);

const dest = getProjectDir() + '/bin/' + cmd.match(/[^/]+$/)[0].replace(/\..*$/, '');
// await $`rm -rf ${dest}`;
await $`ln -s ${cmd} ${dest}`;
await $`chmod a+x ${dest}`;
