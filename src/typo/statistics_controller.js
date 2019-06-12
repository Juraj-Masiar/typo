import {buildElement} from "../utils/modules/html.js";
import {styleBlock} from "../modules/common.js";
import {insertHtml} from "./html_appender.js";


export const StatisticsController = (() => {
  let _okKey = 0;
  let _okWord = 0;
  let _wrongWord = 0;
  let _wrongKey = 0;

  const _okKeyNode = buildElement('div', {style: styleBlock()});
  const _wrongKeyNode = buildElement('div', {style: styleBlock()});
  const _okWordNode = buildElement('div', {style: styleBlock()});
  const _wrongWordNode = buildElement('div', {style: styleBlock()});

  init();
  return {
    reset: reset,
    draw: draw,
    okKey: () => { ++_okKey; draw(); },
    wrongKey: () => { ++_wrongKey; draw(); },
    okWord: () => { ++_okWord; draw(); },
    wrongWord: () => { ++_wrongWord; draw(); },
    getStatistics: getStatistics,
  };

  function init() {
    const _node = buildElement('div', {style: styleBlock(`
  position: fixed; 
  top: 0; 
  right: 0; 
  margin: 10px; 
  padding: 10px;
  font-size: 20px; 
  background: white; 
  box-shadow: 0px 0px 5px -2px #181818;
  border-radius: 12px;
  display: flex;
  `)}, [
    buildElement('statistics-names', {style: styleBlock()}, [
      buildElement('label', {style: styleBlock('margin-right: 5px;'), textContent: 'OK keys:'}),
      buildElement('label', {style: styleBlock('margin-right: 5px;'), textContent: 'OK words:'}),
      buildElement('label', {style: styleBlock('margin-right: 5px;'), textContent: 'Wrong keys:'}),
      buildElement('label', {style: styleBlock('margin-right: 5px;'), textContent: 'Wrong words:'}),
    ]),
    buildElement('statistics-values', {style: styleBlock('margin-left: auto;')}, [
      _okKeyNode,
      _okWordNode,
      _wrongKeyNode,
      _wrongWordNode,
    ]),
    ]);
    insertHtml(_node);
  }

  function reset() {
    _okKey = 0;
    _okWord = 0;
    _wrongKey = 0;
    _wrongWord = 0;
    draw();
  }

  function getStatistics() {
    return {
      okKey: _okKey,
      okWord: _okWord,
      wrongKey: _wrongKey,
      wrongWord: _wrongWord,
    }
  }


  function draw() {
    _okKeyNode.textContent = `${_okKey}`;
    _okWordNode.textContent = `${_okWord}`;
    _wrongKeyNode.textContent = `${_wrongKey}`;
    _wrongWordNode.textContent = `${_wrongWord}`;
  }

})();

