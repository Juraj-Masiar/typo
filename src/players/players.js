import {buildHtml} from "../modules/common.js";
import {replaceChildNodes} from "../utils/modules/html.js";
import {oc, orderByMultipleFactory} from "../utils/modules/utils_module.js";
import {DOMContentLoadedPromise} from "../utils/modules/dom_ready.js";


browser.runtime.onMessage.addListener((data, sender) => {
  switch (data.type) {
    case 'websocket':
      const users = data.data.data;
      update(users);
  }
});

const _container = buildHtml(['div', {}, [
  ['h2', {textContent: 'Players:', style: 'border-bottom: 1px solid gray;'}],
  ['table', {style: 'width: 100%;'}, ['tbody', {}]],
]]);

async function initPlayers() {
  await DOMContentLoadedPromise;
  document.body.appendChild(_container);
}


function drawNodes(nodes) {

  replaceChildNodes(_container.querySelector('tbody'), [buildHtml(['tr', {}, [
    ['th', {textContent: 'Name'}],
    ['th', {textContent: 'Level'}],
    ['th', {textContent: 'Score'}],
    ['th', {textContent: 'Time'}],
    ['th', {textContent: 'OK keys'}],
    ['th', {textContent: 'mistakes'}],
    ['th', {textContent: 'OK words'}],
    ['th', {textContent: 'missed words'}],
  ]]), ...nodes]);
}

function update(users) {
  const nodes = users
    .map(user => ({
      name: user.user_name,
      level: oc(() => user.data.statistics.level, ''),
      score: oc(() => user.data.statistics.score, ''),
      time: oc(() => user.data.statistics.time, ''),
      okKey: oc(() => user.data.statistics.okKey, ''),
      wrongKey: oc(() => user.data.statistics.wrongKey, ''),
      okWord: oc(() => user.data.statistics.okWord, ''),
      wrongWord: oc(() => user.data.statistics.wrongWord, ''),
    }))
    .sort(orderByMultipleFactory([{name: 'score', asc: false}]))
    .map(data => buildHtml(
    ['tr', {}, [
      ['td', {textContent: data.name}],
      ['td', {textContent: data.level}],
      ['td', {textContent: data.score}],
      ['td', {textContent: data.time}],
      ['td', {textContent: data.okKey}],
      ['td', {textContent: data.wrongKey}],
      ['td', {textContent: data.okWord}],
      ['td', {textContent: data.wrongWord}],
    ]]
  ));
  drawNodes(nodes)
}


initPlayers();

