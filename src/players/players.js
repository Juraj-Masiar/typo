import {buildHtml} from "../modules/common.js";
import {replaceChildNodes} from "../utils/modules/html.js";
import {oc} from "../utils/modules/utils_module.js";
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
    ['th', {textContent: 'Score'}],
    ['th', {textContent: 'Time'}],
    ['th', {textContent: 'OK words'}],
    ['th', {textContent: 'Mistakes'}],
  ]]), ...nodes]);
}

function update(users) {
  const nodes = users.map(user => buildHtml(
    ['tr', {}, [
      ['td', {textContent: user.user_name}],
      ['td', {textContent: oc(() => user.data.statistics.okWord, '')}],
      ['td', {textContent: oc(() => user.data.statistics.wrongKey, '')}],
    ]]
  ));
  drawNodes(nodes)
}


initPlayers();

