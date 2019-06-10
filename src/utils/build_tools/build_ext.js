import {HighResolutionTimer} from "../modules/high_resolution_timer.js";
import {setTerminalTitle} from "../modules/terminal.js";
import {timeoutPromise} from "../modules/utils_module.js";
import {BUILD_CHROME, BUILD_FIREFOX, IS_PROD, IS_ZIP, registerWatch, WATCH_CHANGES} from "./build_utils.js";
import {translateMessages} from "./build-messages.js";
import {buildDev} from "./build_dev_ext.js";
import {buildProd, zipDist, zipSources} from "./build_prod_ext.js";

const path = require('path');
const {performance} = require('perf_hooks');

export async function configBuild({inputJsFiles, contentScriptFiles}) {
  // translateMessages({upgradeForeign: IS_PROD});    // currently only during init

  const runBuild = () => startBuild({inputJsFiles, contentScriptFiles});
  if (WATCH_CHANGES) registerWatch(runBuild, ['src', 'firefox', 'chrome', 'locales']);
  else await runBuild();
}

async function startBuild({inputJsFiles, contentScriptFiles}) {
  console.log('starting build');
  await timeoutPromise(50);
  const timer = HighResolutionTimer('', true, {performance});
  const browsers = [
    ...(BUILD_FIREFOX ? ['firefox'] : []),
    ...(BUILD_CHROME ? ['chrome' ]: []),
  ];

  // 1) build DEV
  await Promise.all(browsers.map(browser => buildDev({browser, inputJsFiles, contentScriptFiles})));

  // 2) build PROD
  if (IS_PROD) {
    await Promise.all(browsers.map(async browser => {
      await buildProd({browser, inputJsFiles, contentScriptFiles});

      // 3) create ZIP from dist
      await zipDist(`dist/${browser}-prod.zip`, `${browser}_dist`);
      // 4) create ZIP from source files:
      await zipSources(`dist/${browser}-source-files.zip`, ['build_firefox.js', 'build_config.js', 'package.json'], `${browser}_dev`)
    }));

  }

  setTerminalTitle(`${path.basename(path.resolve('.'))}: ${timer.stop('done')}`);
}



