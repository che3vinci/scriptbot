// #!/usr/bin/env zx

const cmd = argv._[1] || '';
await $`curl -s cheat.sh/${cmd}`;
