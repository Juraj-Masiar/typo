import {IS_PROD, rollupFile, writeFile} from "./build_utils.js";
import {noop} from "../modules/utils_module.js";

const readDir = require('readdir');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const postcss = require('postcss');
const conditionals = require('postcss-conditionals');
const cpx = require("cpx");
const {performance} = require('perf_hooks');
const uglifyEs = require('uglify-es');
const CleanCSS = require('clean-css');
const replace = require('replace-in-file');
const { inlineSource } = require('inline-source');
const {EasyZip} = require('easy-zip2');
const ZipDir = require('zip-dir');


export async function buildProd({browser, inputJsFiles, contentScriptFiles}) {
  const prodPath = `${browser}_dist`;
  const devPath = `${browser}_dev`;
  const IS_CHROME = browser === 'chrome';
  const IS_FIREFOX = browser === 'firefox';
  const getDevFile = fileName => `${devPath}/${fileName}`;
  const getProdFile = fileName => `${prodPath}/${fileName}`;

  // 1) create target directory
  mkdirp.sync(path.dirname('dist'));
  mkdirp.sync(path.dirname(prodPath));

  // 2) copy all except JS and CSS files
  cpx.copySync(`${devPath}/**/*.{html,png,jpg,json,md,svg}`, prodPath);

  // 5) Chrome needs polyfill
  if (IS_CHROME) cpx.copySync(getDevFile('browser-polyfill.min.js'), prodPath);

  // 6) use Rollup to bundle all entry points
  await Promise.all([...inputJsFiles, ...contentScriptFiles].map(async fileName => {
    await rollupFile(getDevFile(fileName), getProdFile(fileName));
  }));

  console.log(`PROD build done, check folder: "${prodPath}"`);
}

export async function zipSources(zipName, filesToZip, sourceFilesFolder) {
  const zip = new EasyZip();
  // zip source files into 'dist/browser-source-files.js'
  const files = filesToZip.map(fileName => ({source: fileName, target: fileName}));

  await new Promise(resolve => zip.batchAdd(files, resolve));
  await new Promise(resolve => zip.zipFolder(sourceFilesFolder, resolve));
  await new Promise(resolve => zip.writeToFile(zipName, resolve));
}
export async function zipDist(zipName, prodFilesFolder) {
  // zip prod files into 'dist/browser-prod.js'   // WARNING: we are using different ZIP engine as others were creating not valid ZIP files!
  await new Promise(resolve => ZipDir(prodFilesFolder, {saveTo: zipName}, resolve));
}

