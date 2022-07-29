import { run } from '@scriptbot/cli';

run({
  async build() {
    await $`pnpm -r build`;
  },
});
