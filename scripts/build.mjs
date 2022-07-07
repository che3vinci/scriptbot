import { run } from '@scriptbot/cli';

run({
    async build(){
        await $`pnpm --filter @automation/apps`;
    }
})
