import {configBuild} from "./src/utils/build_tools/build_ext.js";
import {contentScriptFiles, inputJsFiles} from "./build_config.js";


async function startBuild() {
  await configBuild({inputJsFiles, contentScriptFiles});
}

startBuild();