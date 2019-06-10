import {WS} from "./web_socket.js";
import {timeoutPromise} from "../utils/modules/utils_module.js";

async function RUN_APP() {
  // todo: remove in production:
  // await browser.tabs.reload();    // this will reload current page
  // const tabs = await browser.tabs.query({});
  // const wikiTab = tabs.find(t => t.url.includes('wikipedia.org'));
  // if (!wikiTab) await browser.tabs.create({url: 'https://www.wikipedia.org/'});

  await WS.init();
}


browser.runtime.onMessage.addListener((data, sender) => {
  WS.send('score', data);
  switch (data.type) {

  }
});


// when user clicks the toolbar icon, execute "content script" in current page
browser.browserAction.onClicked.addListener(async tab => {
  await browser.tabs.executeScript(tab.id, {
    allFrames: false,
    file: '/typo/typo.js',
    runAt: 'document_start'
  }).then(console.log, console.error);
  // if (await browser.tabs.sendMessage(tab.id, {type: 'ping'}).catch(() => false)) {   // if the script is already injected, we reload the page
  //   await browser.tabs.reload();
  //   await timeoutPromise(500);
  // }


});




RUN_APP();