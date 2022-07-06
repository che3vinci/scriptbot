import { $, chalk } from 'zx';
const input = (text, stdin) => {
    stdin.write(text);
};
export async function exec(cmd, inputs) {
    $.quote = e => e;
    if (!inputs) {
        return await $ `${cmd}`;
    }
    const { stdin, stdout, exitCode } = $ `${cmd}`;
    for await (const chunk of stdout) {
        for (const each of inputs) {
            if (each.regex.test(chunk)) {
                input(each.input, stdin);
                console.log('===>match', each.regex, String(chunk));
                break;
            }
        }
    }
    if ((await exitCode) !== 0) {
        console.log(chalk.red('===>commit failure. exit'));
        process.exit(-1);
    }
}
//# sourceMappingURL=exec.js.map