#!/usr/bin/env zx

import { run } from '@c3/cli';
import { os } from 'zx';
import inquirer from 'inquirer';

run({
  //open with code
  async code(options) {
    const home = os.home;
    $.verbose = false;
    const {
      e = 'ts',
      name = '',
      cw = '1d',
      from = `${os.homedir()}/code`,
    } = options;
    const { stdout } =
      await $`fd -t file -i -e ${e} --search-path ${from} --regex ${name} --changed-within ${cw}`;
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'file',
          message: 'What do you want to select?',
          choices: stdout.split('\n'),
        },
      ])
      .then(answers => {
        $`code ${answers.file}`;
      });
  },
});
