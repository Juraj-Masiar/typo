import {buildElement, replaceChildNodes, setStyle} from "../utils/modules/html.js";
import {styleBlock} from "../modules/common.js";
import {insertHtml} from "./html_appender.js";


export const ListController = (() => {
  const _container = init();
  return {
    drawWords: drawWords,
    drawNodes: drawNodes,
    highlightWord: highlightWord,
  };

  function init() {

    const box = buildElement('list-words', {
      style: styleBlock(`
      position: fixed; 
      top: 90px; 
      height: calc(100% - 90px - 50px);
      overflow-y: auto;
      right: 0; 
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

  function drawWords(words) {
    const nodes = words.map(w => buildElement('word', {style: styleBlock(``), textContent: w}));
    drawNodes(nodes)
  }

  function highlightWord(word, color) {
    // todo: this is very weak implementation because it always finds only the first occurrence of the word PLUS it ignores the case
    const wordNode = [..._container.childNodes].find(node => node.textContent.toLowerCase() === word.toLowerCase());
    setStyle(wordNode, 'background', color);
  }

})();

