import {WordsController} from "./words_controller.js";
import {ListController} from "./list_controller.js";
import {buildHtml, shuffleArray, styleBlock, styleNode} from "../modules/common.js";
import {InputController} from "./input_controller.js";
import {PageTextExtractor} from "./page_text_extractor.js";
import {insertHtml} from "./html_appender.js";
import {byId} from "../utils/modules/html.js";
import {StatisticsController} from "./statistics_controller.js";
import {timeoutPromise} from "../utils/modules/utils_module";
import {contDown} from "./count_down.js";


export const ScreenController = (() => {
  const duration = 9000;
  let _container;

  return {
    startGame: startGame,
    initialize: initialize,
    // showWelcome: showWelcome,
    // showEnd: showEnd,
  };

  async function initialize() {
    const {user_name: userName = ''} = await browser.storage.local.get('user_name');
    browser.runtime.sendMessage({type: 'user_name', userName});

    _container = buildHtml(['welcome-screen', {
      style: styleBlock(`
      position: fixed; 
      top: 90px; 
      left: 25%;
      width: 50%;
      margin: 10px; 
      padding: 10px;
      background: lightgreen;
      font-size: 20px; 
      box-shadow: 0px 0px 5px -2px #181818;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `)
    }, [
      ['h1', {style: styleBlock('font-size: 42px; margin: 10px 0; font-family: Courier New,Verdana, Helvetica, sans-serif;'), textContent: 'Welcome to Typo!'}],
      ['button', {style: getButtonStyle(), textContent: 'Start game with current page', handlers: {onclick: startGame}}],
      ['button', {style: getButtonStyle(), textContent: 'Level 1 - short and simple', handlers: {onclick: () => startGame({level: 1})}}],
      ['button', {style: getButtonStyle(), textContent: 'Level 2 - long and simple', handlers: {onclick: () => startGame({level: 2})}}],
      ['button', {style: getButtonStyle(), textContent: 'Level 3 - long with diacritics', handlers: {onclick: () => startGame({level: 3})}}],
      ['user_info', {style: styleBlock('width: 100%')}, [
        ['h2', {style: styleBlock('font-size: 20px; margin: 10px 0;'), textContent: 'User:'}],
        ['input', {id: 'user_name', style: styleBlock('font-size: 20px; margin: 10px 0; background: white;'), maxlength: '10', value: userName, placeholder: 'enter your name', handlers: {oninput: onUserNameChange}}],
      ]],
      ['options', {style: styleBlock('width: 100%')}, [
        ['h2', {style: styleBlock('font-size: 20px; margin: 10px 0;'), textContent: 'Options:'}],
        createTextCheckbox('lower_case', 'Lower case only', false),
        createTextCheckbox('no_diacritics', 'Without diacritics', false),
        createTextCheckbox('shuffle', 'Shuffle words', false),
      ]]
    ]
    ]);
    insertHtml(_container);
  }


  async function startGame({level, userText} = {}) {
    // loading options:
    const filterDiacritics = array => array.filter(word => word.match(new RegExp('^[A-z]+$')));
    const makeLowerCase = array => array.map(w => w.toLowerCase());
    const makeRandom = array => shuffleArray(array);
    const noChangedFn = array => array;
    const modificationsFunctions = [
      byId('lower_case').checked ? filterDiacritics : noChangedFn,
      byId('no_diacritics').checked ? makeLowerCase : noChangedFn,
      byId('shuffle').checked ? makeRandom : noChangedFn,
    ];
    // remove from DOM asap
    _container.remove();
    // count down - get ready!
    await contDown(3);
    StatisticsController.reset({level: level});
    browser.runtime.sendMessage({type: 'statistics', statistics: StatisticsController.getStatistics()});
    InputController.stealFocus();
    console.log('starting game');
    let words = [];
    let levelDuration = duration;

    if (userText) {
      words = PageTextExtractor.parseWords(userText);
    }
    else if (level) {
      const {name, text, duration} = await browser.runtime.sendMessage({type: 'fetch_level', level});
      if (duration) levelDuration = duration;
      words = PageTextExtractor.parseWords(text);
    }
    else {
      const originalWords = PageTextExtractor.getWords();
      words = modificationsFunctions.reduce((acc, fn) => fn(acc), originalWords);
    }

    ListController.drawWords(words);
    // this will wait on this line until all words fall
    await WordsController.startGame(words, {animationDuration: levelDuration});

    InputController.returnFocus();
    StatisticsController.stopLevel();
    browser.runtime.sendMessage({type: 'statistics', statistics: StatisticsController.getStatistics()});

    await insertHtml(_container);
  }

  function onUserNameChange(e) {
    const name = e.target.value;
    browser.storage.local.set({user_name: name});
    browser.runtime.sendMessage({type: 'user_name', name});
  }

  function getButtonStyle(customStyle = '', size = 2) {
    return styleBlock(`
      padding: ${size}px ${size * 2 + 1}px;
      margin: 4px;
      font-size: 20px;
      background-color: white;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      -moz-user-select: none;
      user-select: none;
      border: 1px solid #ccc;
      ${customStyle}
      `);
  }

  function createTextCheckbox(id, text, value) {
    return ['div', {style: styleBlock(`display: flex; align-items: center;`)}, [
      createCheckbox(value, {id: id}),
      ['label', {style: styleNode(`cursor: default;`), for: id, textContent: text}],
    ]]
  }

  function createCheckbox(value, attributes = {}, customStyle = '') {
    return ['input', {
      type: 'checkbox',
      ...attributes,
      ...(value ? {checked: true} : {}),
      style: styleNode(`width: 14px; height: 14px; margin: 0 10px 0 0; appearance: checkbox; -moz-appearance: checkbox; -webkit-appearance: checkbox;${customStyle}`)
    }]
  }

})();

