import {buildElement, replaceChildNodes} from "../utils/modules/html.js";
import {buildHtml, styleBlock, styleNode, styleTd, styleTr} from "../modules/common.js";
import {insertHtml} from "./html_appender.js";
import {oc} from "../utils/modules/utils_module.js";


export const MultiPlayerController = (() => {
  const _container = init();
  return {

  };

  function init() {

    const box = buildHtml(['iframe', {
      src: '/players/players.html',
      style: styleBlock(`
        position: fixed; 
        top: 90px; 
        height: calc(100% - 90px - 50px);
        overflow-y: auto;
        left: 0; 
        margin: 10px; 
        padding: 10px;
        font-size: 20px; 
        background: white; 
        display: flex;
        flex-direction: column;
        box-shadow: 0px 0px 5px -2px #181818;
        border-radius: 12px;
      `)
    }]);
    insertHtml(box);
    return box;
  }

})();
