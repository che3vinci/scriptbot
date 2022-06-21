#!/usr/bin/env zx
import { $, fs, which } from 'zx';
import { createProject, getProjectDir, Json, run, chromeApp } from '@c3/cli';
import { assert } from 'console';

const PORT = 9999;
const vscodeLaunchJSon = `{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "attach",
      "name": "findora",
      "webRoot": "\${workspaceFolder}",
      "port": ${PORT}
    }
  ]
}
`;

const project = getProjectDir();

run({
  async attach2Chrome() {
    await $`echo ${vscodeLaunchJSon} > ${project}/.vscode/launch.json`;
    await $`killall "Google\ Chrome"`;
    await $`${chromeApp}  --remote-debugging-port=${PORT}`;
  },

  async node(options) {
    const { program, args } = options || {};
    assert(
      !!program,
      'Please input program name to be debugged.such as  --program vite --args build'
    );
    console.warn(
      'nextStep:attach to this node process in vscode.("Debug:Attach to Node process")'
    );
    const _program = await which(program);
    await $`/usr/bin/env node --inspect-brk ${_program} ${args || ''}`;
    
    console.log('go to chrome,input chrome://inspect and click the "inpsect" text button for remote target');
  },

  // proxy mobiel to localhost
  async mobile(option) {
    await $`${chromeApp} https://share.getcloudapp.com/kpu8wWom`;
  
  },
  async react() {},

  /**
   * support source map discovery
   * @param options {program, args}
   */
  async jest(options) {
    const vscodeLaunchJSon = `{
      "version": "0.2.0",
    "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "--inspect-brk",
        "\${workspaceRoot}/node_modules/.bin/jest",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "resolveSourceMapLocations":[
          "\${workspaceFolder}/**",
          "**/node_modules/**"
      ]
    }]
    }
    
    `;
    await $`echo ${vscodeLaunchJSon} > ${project}/.vscode/launch.json`;
    console.log(
      '===>@next: set breakpoint and  run this configure file in vscode'
    );
  },
  async preact() {
    await createProject({ projectName: 'preact-test-1' });
    await $`scf babel`;
    await $`scf jest`;
    new Json('./package.json')
      .set('jest.transformIgnorePatterns', [])
      .set('jest.testEnvironment', 'jsdom');
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/preact/babel.config.js`;
    await $`pnpm add preact`;
    await $`wget -q https://raw.githubusercontent.com/che3vinci/react-template/master/templates/preact/demo.test.js`;
    await $`mkdir test && mv demo.test.js test/demo.test.js`;

    await $`jest`;
  },
  async stitches() {
    //    await createProject({ projectName: 'stitches-test-1' });
    //@first: make debugger auto attach to process
    await $`yarn test `;
  },
});
