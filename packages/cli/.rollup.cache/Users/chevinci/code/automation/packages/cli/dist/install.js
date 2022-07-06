import { $ } from 'zx';
export async function installIfNeeded(cmd, installCmd) {
    try {
        await $ `which ${cmd}`;
    }
    catch (e) {
        await $ `${installCmd}`;
    }
}
//# sourceMappingURL=install.js.map