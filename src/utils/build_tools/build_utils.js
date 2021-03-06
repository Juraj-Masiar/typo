import {ExecutorOneByLastOne} from "../modules/executors.js";
import {escapeRegExp} from "../modules/text_processing.js";

const watch = require('watch');
const readDir = require('readdir');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const cpx = require("cpx");
const {performance} = require('perf_hooks');
const rollup = require('rollup');

export const params = process.argv.slice(2);
export const WATCH_CHANGES = params.includes('watch');
export const BUILD_FIREFOX = params.includes('firefox');
export const BUILD_CHROME = params.includes('chrome');
export const IS_ZIP = params.includes('zip');
export const IS_PROD = params.includes('prod');
export const IS_DEV = !IS_PROD;

// WARNING: I know these two lines are ugly, but let's pretend they're not here :D
String.prototype.replaceAll = function (find, replace) {return this.replace(new RegExp(escapeRegExp(find), 'g'), replace)};
String.prototype.replaceLines = function (find, replace) {return this.replace(new RegExp(`^.*${escapeRegExp(find)}.*$`, 'mg'), replace)};


export function registerWatch(buildFn, watchFolders) {
  const executor = ExecutorOneByLastOne(buildFn);
  const onChange = () => executor.addWorkAndExecute();
  const watchOptions = {ignoreDotFiles: true, interval: 1, ignoreDirectoryPattern: /_locales/};
  watchFolders.forEach(folder => watch.watchTree(folder, watchOptions, onChange));
}

export async function rollupFile(srcFile, targetFile) {
  const bundle = await rollup.rollup({
    input: srcFile
  });
  await bundle.write({
    file: targetFile,
    format: 'iife',
  });
  // const {output} = await bundle.generate({
  //   file: targetFile,
  //   format: 'iife',
  // });
  // const [{code}] = output;
  // return code;
}

export function renameToReplace(from, to) {
  fs.unlinkSync(to);
  fs.renameSync(from, to);
}

export function writeFile(filePath, code) {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, code);
}



