// take sources from "src" and "firefox" / "chrome" folders and build necessary stuff
import {IS_DEV, IS_PROD, renameToReplace, rollupFile} from "./build_utils.js";
import {escapeRegExp} from "../modules/text_processing.js";

const cpx = require("cpx");
const replace = require('replace-in-file');

export async function buildDev({browser, inputJsFiles, contentScriptFiles}) {
  const IS_CHROME = browser === 'chrome';
  const IS_FIREFOX = browser === 'firefox';
  const devPath = `${browser}_dev`;
  const getDevFile = fileName => `${devPath}/${fileName}`;

  // 1) copy all files to dev folder
  cpx.copySync('src/**/*.{js,html,css,png,jpg,json,md,svg}', devPath);
  cpx.copySync(`${browser}/**/*.{js,html,css,png,jpg,json,md,svg}`, devPath);

  // 3) replace placeholders for JS files
  const replacements = {
    $IS_FIREFOX: IS_FIREFOX,
    $IS_CHROME: IS_CHROME,
    $IS_DEV: IS_DEV,
    $IS_PROD: IS_PROD,
  };
  await replace({
    files: `${devPath}/**/*.js`,
    from: Object.keys(replacements).map(key => new RegExp(escapeRegExp(key), 'g')),
    to: Object.values(replacements),
  });

  // 4) bundle content scripts
  await Promise.all(contentScriptFiles.map(fileName => rollupFile(getDevFile(fileName), getDevFile(fileName))))
}