

export const PageTextExtractor = (() => {
  return {
    getTextBlocks: getTextBlocks,
    getSentences: getSentences,
    getWords: getWords,
    getSimpleWords: getSimpleWords,
  };

  function getTextBlocks() {
    const textNodes = getTextNodes();
    const textBlocks = textNodes.map(node => node.textContent.trim());
    return textBlocks.filter(x => x);
  }

  function getSentences() {
    const blocks = getTextBlocks();
    const blocksOfSentences = blocks.map(textBlock => textBlock.split('.'));
    const sentences = flatten(blocksOfSentences).map(sentence => sentence.trim());
    return sentences.filter(x => x);
  }

  function getWords(shuffle = false) {
    const sentences = getSentences();
    const sentencesWithWords = sentences.map(sentence => sentence.split(' '));
    const words = flatten(sentencesWithWords).map(word => word.trim());
    const filteredWords = words
      .filter(word => word)
      .filter(word => word.match(new RegExp('[A-zÀ-ÿ]')));   // keep only words with alphanumeric characters: https://stackoverflow.com/a/26900132/1376947
    return shuffle ? shuffleArray(filteredWords) : filteredWords;
  }
  
  function getSimpleWords() {
    return getWords()
      .filter(word => word.match(new RegExp('^[A-z]+$')))
  }
})();
