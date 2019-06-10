import {buildElement, replaceChildNodes} from "../utils/modules/html.js";
import {buildHtml, styleBlock} from "../modules/common.js";
import {insertHtml} from "./html_appender.js";


export const MultiPlayerController = (() => {
  const _container = init();
  return {
    update: update,
  };

  function init() {

    const box = buildElement('players', {
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
      border: 1px solid black;
      display: flex;
      flex-direction: column;
      box-shadow: 4px 5px 4px 0px #181818;
    `)
    });
    insertHtml(box);
    return box;
  }

  function drawNodes(nodes) {
    replaceChildNodes(_container, nodes);
  }

  function update(users) {
    const nodes = users.map(user => buildHtml([
      'div', {style: styleBlock('display: flex;')}, [
        ['label', {textContent: user.user_name}],
        // todo: print more info here?
      ]
    ]));
    drawNodes(nodes)
  }

})();

