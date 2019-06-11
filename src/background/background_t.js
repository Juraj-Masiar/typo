import {WS} from "./web_socket.js";
import {timeoutPromise} from "../utils/modules/utils_module.js";

async function RUN_APP() {
  await WS.init();
  if ($IS_DEV) {
    browser.tabs.create({url: '/test_page.html'});

  }
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