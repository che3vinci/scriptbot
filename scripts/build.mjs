import { run } from '@auto-scripts/cli';

run({
    async build(){
        await $`pnpm --filter @automation/apps`;
    }
})
