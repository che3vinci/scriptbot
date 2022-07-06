export const getNpx = (npm) => {
    switch (npm) {
        case 'npm':
        case 'yarn':
            return 'npx';
        case 'pnpm':
            return 'pnpx';
        default:
            throw new Error(`${npm} is not supported`);
    }
};
//# sourceMappingURL=getNpx.js.map