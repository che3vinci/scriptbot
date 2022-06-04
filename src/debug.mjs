#!/usr/bin/env zx
import { $, fs, which } from 'zx';
import { getProjectDir, Json, run } from '@c3/cli';
import { assert } from 'console';

const PORT = 9999;
const workspaceFolder = 'workspaceFolder';
const vscodeLaunchJSon = `{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "attach",
      "name": "findora",
      "webRoot": "${workspaceFolder}",
      "port": ${PORT}
    }
  ]
}
`;

const project = getProjectDir();

run({
  async attach2Chrome() {
    const chrome =
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    await $`echo ${vscodeLaunchJSon} > ${project}/.vscode/launch.json`;
    await $`killall "Google\ Chrome"`;
    await $`${chrome}  --remote-debugging-port=${PORT}`;
  },
  async node(options) {
    const { program, args } = options;
    assert(
      !!program,
      'Please input program name to be debugged.such as  --program vite --args build'
    );
    console.warn(
      'attach to this node process in vscode.("Debug:Attach to Node process")'
    );
    const _program = await which(program);
    await $`/usr/bin/env node --inspect-brk ${_program} ${args || ''}`;
  },
});
