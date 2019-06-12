import {getTime, getUUID, noop} from "../utils/modules/utils_module.js";
import {HOST_TYPO} from "../modules/hosts.js";


const WS_URL = HOST_TYPO.replace(new RegExp('^https?'), 'ws') + 'ws/global';

const CLIENT_UUID = getUUID();

let _connection = {readyState: 3, close: noop, send: noop};   // init with dummy

export const WS = {
  init: init,
  send: send
};
Object.freeze(WS);

// init phase:
async function init() {
  await connect();
}

async function send(type, data) {
  const {user_name} = await browser.storage.local.get('user_name') || 'anonymous';
  _connection.send(JSON.stringify({
    type: type,
    user_name: user_name,
    data: data,
    uuid: CLIENT_UUID,
    version: getTime(),
  }));
}

async function onMessage(e) {
  const data = JSON.parse(e.data);
  console.log('WS: message received', data);

  (await browser.tabs.query({})).forEach(tab => browser.tabs.sendMessage(tab.id, {type: 'websocket', data: data}).catch(noop));

  // browser.runtime.sendMessage({type: 'websocket', data: data})
}

async function connect() {
  _connection.close();
  _connection = new WebSocket(WS_URL);
  _connection.onopen = onOpen;
  _connection.onmessage = onMessage;
}
function onOpen(e) {
  console.log('WS: connected', e);
  send('hello', `hello from client`);
}

