var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { $, cd, chalk, os, fs, argv } from "zx";
import fs$1, { existsSync } from "fs";
import { resolve, parse } from "path";
import utils from "@c3/utils";
import _ from "lodash";
const chromeApp = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const getNpx = (npm) => {
  switch (npm) {
    case "npm":
    case "yarn":
      return "npx";
    case "pnpm":
      return "pnpx";
    default:
      throw new Error(`${npm} is not supported`);
  }
};
const projects = {
  a: async ({ projectName, npm }) => {
    await $`${getNpx(npm)} degit fabien-ml/react-ts-vite-template ${projectName}`;
  },
  viteTs: async ({ projectName, npm }) => {
    await $`${npm} create vite ${projectName} --template react-ts`;
  },
  bone: async ({ projectName, npm }) => {
    await $`mkdir ${projectName}`;
    cd(projectName);
    await $`${npm} init `;
    const pkgs = ["react", "react-dom", "vite", "@vitejs/plugin-react"];
    await $`${npm} add ${pkgs}`;
  },
  cra: async ({ projectName, npm }) => {
    await $`${getNpx(npm)} create-react-app ${projectName} --template typescript`;
  }
};
const createProject = async (option) => {
  $.quote = (e) => e;
  const { projectName = "my-app", baseDir = "/tmp", type = "viteTs", npm = "pnpm", before } = option || {};
  const projectDir = `${baseDir}/${projectName}`;
  await cd(baseDir);
  await $`rm -rf ${projectName}`;
  await projects[type].call(projects, { projectName, baseDir, type, npm });
  await cd(projectDir);
  before && await before();
  npm === "pnpm" && await $`echo 'auto-install-peers=true' >> .npmrc`;
  await $`${npm} install`;
};
const input = (text, stdin) => {
  stdin.write(text);
};
async function exec(cmd, inputs) {
  $.quote = (e) => e;
  if (!inputs) {
    return await $`${cmd}`;
  }
  const { stdin, stdout, exitCode } = $`${cmd}`;
  for await (const chunk of stdout) {
    for (const each of inputs) {
      if (each.regex.test(chunk)) {
        input(each.input, stdin);
        console.log("===>match", each.regex, String(chunk));
        break;
      }
    }
  }
  if (await exitCode !== 0) {
    console.log(chalk.red("===>commit failure. exit"));
    process.exit(-1);
  }
}
const getProjectDir = () => {
  let curDir = process.cwd();
  const home = os.homedir();
  while (!existsSync(`${curDir}/package.json`) && curDir !== home) {
    curDir = resolve(curDir, "..");
  }
  return curDir == home ? null : curDir;
};
async function installIfNeeded(cmd, installCmd) {
  try {
    await $`which ${cmd}`;
  } catch (e) {
    await $`${installCmd}`;
  }
}
const { isPlainObject, isArray, toArray } = utils;
class Json {
  constructor(file) {
    this._file = file;
    this._data = fs.readJsonSync(file, { encoding: "utf-8" });
  }
  set(path, value) {
    _.set(this._data, path, value);
    this.save();
    return this;
  }
  append(path, value) {
    let data = this.get(path);
    if (isArray(data)) {
      data.push(...toArray(value));
    } else if (isPlainObject(data) && isPlainObject(value)) {
      data = __spreadValues(__spreadValues({}, data), value);
    } else {
      throw new Error("not supported type");
    }
    this.set(path, data);
  }
  get(path) {
    return _.get(this._data, path);
  }
  save() {
    fs.writeFileSync(this._file, JSON.stringify(this._data), {
      encoding: "utf-8"
    });
    return this;
  }
  get file() {
    return this._file;
  }
  get data() {
    return this._data;
  }
}
const copyJsonField = async (src, desc) => {
  let srcName = src.file;
  const isHttpFile = /^https?:/.test(src.file);
  if (isHttpFile) {
    srcName = parse(srcName).name;
    await $`wget ${src.file} -O ${srcName}`;
  }
  new Json(desc.file).set(desc.path, new Json(srcName).get(src.path)).save();
  if (isHttpFile) {
    await $`rm ${srcName}`;
  }
};
const replaceTextInFile = (file, search, replace) => {
  const content = fs$1.readFileSync(file, "utf8");
  const newContent = content.replace(search, replace);
  fs$1.writeFileSync(file, newContent);
};
const { assert, omit } = utils;
async function run(option) {
  assert(argv._.length === 2, `provide a subcommand:${JSON.stringify(argv)}`);
  await option[argv._[1]].call(option, omit(argv, ["_"]));
}
const getTemplateFile = (category) => (file) => {
  const project = getProjectDir();
  return `${project}/../templates/${category}/${file}`;
};
export { Json, chromeApp, copyJsonField, createProject, exec, getNpx, getProjectDir, getTemplateFile, installIfNeeded, projects, replaceTextInFile, run };
