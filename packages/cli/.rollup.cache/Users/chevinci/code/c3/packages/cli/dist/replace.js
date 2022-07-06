import fs from 'fs';
export const replaceTextInFile = (file, search, replace) => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(search, replace);
    fs.writeFileSync(file, newContent);
};
//# sourceMappingURL=replace.js.map