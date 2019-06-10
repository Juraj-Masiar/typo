import {ScreenController} from "./screen_controller.js";
import {MultiPlayerController} from "./multi_player_controller.js";
import {WordsController} from "./words_controller.js";
import {InputController} from "./input_controller.js";
import {ListController} from "./list_controller.js";
import {setStyle} from "../utils/modules/html.js";
import {StatisticsController} from "./statistics_controller.js";

console.log('hello from typo.js');

browser.runtime.onMessage.addListener((data, sender) => {
  console.log('received message', data);
  switch (data.type) {
    case 'ping': return Promise.resolve('pong');
    case 'websocket':
      const users = data.data.data;
      MultiPlayerController.update(users);
  }
});


async function RUN_TYPO() {
  console.log('hello from typo.js script');
  document.body.style.background = 'lightgray';
  WordsController.addWordCreatedEventListener(onWordStart);




  ScreenController.initialize();


  InputController.addOnEscHandler(onEscHandler);

  InputController.addListener((userText, constroller) => {
    // this code is executed when user types anything
    console.log(userText);

    WordsController.forEachWord(({animation, node, text, highlightNode}, i) => {
      // iterate though all falling words:
      if (text.startsWith(userText) && userText.length > 0) {
        highlightNode.textContent =  userText;
        setStyle(highlightNode, 'visibility', 'visible');
      }
      else {
        setStyle(highlightNode, 'visibility', 'hidden');

      }
      // todo: replace this block with something that will do the right thing
      if (text === userText) {
        animation.cancel();
        node.remove();
        highlightNode.remove();
        node.style.background = 'yellow';
        node.style.color = 'black';
        InputController.clear();   // this clears what user wrote
        StatisticsController.okWord();
        ListController.highlightWord(text, 'lightgreen');
      }
      if (!text.startsWith(userText)) {
        console.error('CHYBA');
        StatisticsController.wrongKey();
      } else {
        StatisticsController.okKey();
      }

    })

  });


  StatisticsController.draw();
  console.log('Game Over');

}

// executed for each falling word
function onWordStart({animation, node, text, highlightNode}) {
  console.log('new word is now falling:', text);
  InputController.clear();   // this clears what user wrote
  animation.finished.then(() => {
    StatisticsController.wrongWord();
    ListController.highlightWord(text, 'red');
  });
  browser.runtime.sendMessage({type: 'statistics', statistics: StatisticsController.getStatistics()});
  console.log(StatisticsController.getStatistics());
  const {okWord, wrongWord} = StatisticsController.getStatistics();
  WordsController.setAnimationDuration(Math.max(3000, 9000 - 500 * (wrongWord + okWord)));

}

function onEscHandler(event) {
  console.log('ESC pressed');
  const {animation, animationH, node, text, highlightNode} = WordsController.getCurrentWord();
  if (animation.isPaused()) {
    animation.unpause();
    animationH.unpause();
    InputController.enableTyping();
  } else {
    animation.pause();
    animationH.pause();
    InputController.disableTyping();
  }
}


RUN_TYPO();
