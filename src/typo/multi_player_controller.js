import {buildElement, replaceChildNodes} from "../utils/modules/html.js";
import {buildHtml, styleBlock, styleNode, styleTd, styleTr} from "../modules/common.js";
import {insertHtml} from "./html_appender.js";
import {oc} from "../utils/modules/utils_module.js";


export const MultiPlayerController = (() => {
  const _container = init();
  return {
    update: update,
  };

  function init() {

    const box = buildHtml(['multiplayer', {
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
    }, [
      ['h1', {textContent: 'Players:', style: styleBlock('font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid gray;')}],
      ['table', {style: styleNode('width: 100%;')}, ['tbody', {style: styleNode()}]],
    ]]);
    insertHtml(box);
    return box;
  }

  function drawNodes(nodes) {
    replaceChildNodes(_container.querySelector('tbody'), [buildHtml(['tr', {style: styleTr()}, [
      ['th', {textContent: 'Name', style: styleTd(thStyle + 'font-weight: bold;')}],
      ['th', {textContent: 'OK words', style: styleTd(thStyle + 'font-weight: bold;')}],
      ['th', {textContent: 'Mistakes', style: styleTd(thStyle + 'font-weight: bold;')}],
    ]]), ...nodes]);
  }

  function update(users) {
    const nodes = users.map(user => buildHtml(
      ['tr', {style: styleTr()}, [
        ['th', {textContent: user.user_name, style: styleTd(thStyle)}],
        ['td', {textContent: oc(() => user.data.statistics.okWord, ''), style: styleTd(thStyle)}],
        ['td', {textContent: oc(() => user.data.statistics.wrongKey, ''), style: styleTd(thStyle)}],
      ]]
    ));
    drawNodes(nodes)
  }

})();

const thStyle = `
padding: 0 3px;
border-right: 1px solid gray;
border-bottom: 1px solid gray;
`;