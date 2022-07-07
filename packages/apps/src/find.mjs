
import { run } from '@scriptbot/cli';
import inquirer from 'inquirer';
import { spinner } from 'zx/experimental';

run({
  //open with code
  async open(options) {
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
  async rm(options) {
    $.verbose = false;
    const { cmd } = options;
    const { stdout } = await $`${cmd}`;
    const list = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'files',
        message: 'What do you want to remove?',
        choices: stdout.split('\n'),
      },
    ]);
    const confirm = await inquirer.prompt([
      {
        type: 'list',
        name: 'confirm',
        message: `are you sure want to delete this files?`,
        choices: ['yes', 'no'],
      },
    ]);
    if (confirm['confirm'] === 'yes') {
      $.verbose = true;
      let stop = spinner();
      for (let res of list['files']) {
        await $`rm -rf ${res}`;
      }
      stop();
    }
  },
});
