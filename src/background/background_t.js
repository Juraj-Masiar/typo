import {WS} from "./web_socket.js";
import {timeoutPromise} from "../utils/modules/utils_module.js";
import {LevelDownload} from "./level_download.js";

async function RUN_APP() {
  await WS.init();
  if ($IS_DEV) {
    browser.tabs.create({url: '/typo/test_page.html'});

  }
}


browser.runtime.onMessage.addListener((data, sender) => {
  switch (data.type) {
    case 'fetch_level': return LevelDownload.getLevel(data.level);
    case 'notify': return WS.send('notify', data);
    case 'user_name': return WS.send('name', data);
    case 'statistics': return WS.send('score', data);
  }
});


// when user clicks the toolbar icon, execute "content script" in current page
browser.browserAction.onClicked.addListener(startTypo);

async function startTypo(tab) {
  if ($IS_CHROME) await browser.tabs.executeScript(tab.id, {
    allFrames: false,
    file: '/browser-polyfill.min.js',
    runAt: 'document_end'
  });
  await browser.tabs.executeScript(tab.id, {
    allFrames: false,
    file: '/typo/typo.js',
    runAt: 'document_start'
  }).then(console.log, console.error);
  // if (await browser.tabs.sendMessage(tab.id, {type: 'ping'}).catch(() => false)) {   // if the script is already injected, we reload the page
  //   await browser.tabs.reload();
  //   await timeoutPromise(500);
  // }


}

browser.contextMenus.create({
  id: "remove-me",
  title: 'Play Typo with this text',
  contexts: ["selection"],
  onclick: async (info, tab) => {
    await startTypo(tab);
    await browser.tabs.sendMessage(tab.id, {type: 'textToPlay', text: info.selectionText});
  }
});


RUN_APP();