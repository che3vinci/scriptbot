#!/usr/bin/env zx
import 'zx/globals';

const cmd = argv._[1] || '';
await $`curl cheat.sh/${cmd}`;
