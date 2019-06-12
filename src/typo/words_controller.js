import {buildElement} from "../utils/modules/html.js";
import {removeFromArrayPredicate, styleNode} from "../modules/common.js";
import {NodeAnimator} from "./node_animator.js";
import {insertHtml} from "./html_appender.js";

export const WordsController = (() => {
  const _fallingWords = [];   // contains objects with "animation", "node" and "text" properties
  const _wordListeners = [];
  let _animationDuration = 0;

  return {
    forEachWord: forEachWord,
    getCurrentWord: getCurrentWord,
    addWordCreatedEventListener: fn => _wordListeners.push(fn),
    startGame: startGame,
    setAnimationDuration: animationTime => _animationDuration = animationTime,
  };

  async function startGame(words, {animationDuration}) {
    const wordsNodes = words
      .map(word => buildElement('span', {
        style: styleNode(`
        background: #FF00FF; 
        color: black; 
        display: inline-block; 
        font-size: 20px; 
        padding: 4px;
        `),
        textContent: word.toLowerCase()
      }));

    console.log('wn', wordsNodes, words);

    _fallingWords.length = 0;   // clear list of words
    // Animation of all nodes:
    for (let i = 0; i < wordsNodes.length; i++) {
      // extract node
      const wordNode = wordsNodes[i];
      // add it to the page body
      insertHtml(wordNode);
      // start the animation
      const startX = (window.innerWidth / 2);
      const startY = (0);
      const endY = (window.innerHeight);
      const highlightNode = buildElement('span', {
        style: styleNode(`background: black; 
        visibility: hidden; 
        color: white; 
        display: inline-block; 
        font-size: 20px; 
        padding: 4px;
        padding-right: 0;
        ;`),
        textContent: ''
      });
      insertHtml(highlightNode);

      const animationH = NodeAnimator.fromUpToDown(highlightNode, startX, startY, endY, _animationDuration || animationDuration);
      const animation = NodeAnimator.fromUpToDown(wordNode, startX, startY, endY, _animationDuration || animationDuration);
      // add falling word to the list of all falling words
      const wordItem = {
        animation: animation,
        animationH: animationH,
        node: wordNode,
        highlightNode: highlightNode,
        text: wordNode.textContent
      };
      _fallingWords.push(wordItem);
      _wordListeners.forEach(fn => fn(wordItem));

      // todo: when animation is done, we can do something...
      animation.finished.catch(() => {}).then(() => {
        console.log('word animation done', wordNode);
        wordNode.remove();
        removeFromArrayPredicate(_fallingWords, item => item.animation.id === animation.id);
      });
      // wait for animation to finish (or be canceled)
      await animation.finished.catch(() => {});
    }
  }

  function forEachWord(fn) {
    // const wordsOnScreen = _fallingWords.filter(({animation, node, text}) => {
    //
    // })

    _fallingWords.forEach(fn);
  }

  function getCurrentWord() {
    return _fallingWords[_fallingWords.length - 1];
  }

})();

