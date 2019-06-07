'use strict';

// BUILD FROM .json TO messages.xx:
// console.log(Object.entries(JSON.parse(`YOUR_JSON_FILE_CONTENT_GOES_HERE`)).map(([key, value]) => `${key}=${value.message || ''}`).join('\n'));

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

export function translateMessages({
  localesDir = 'locales',
  targetDir = 'src/_locales',
  upgradeForeign = false,
} = {}) {
  mkdirp.sync(path.dirname(targetDir));

  // WARNING: Manual copy of Czech from Slovak!!!
  fs.writeFileSync(path.join(localesDir, 'messages.cs'), fs.readFileSync(path.join(localesDir, 'messages.sk'), 'utf8'));
  // WARNING: renaming Play Framework style to WebExtension style
  if (fs.existsSync(path.join(localesDir, 'messages.zh-TW'))) fs.renameSync(path.join(localesDir, 'messages.zh-TW'), path.join(localesDir, 'messages.zh_TW'));
  if (fs.existsSync(path.join(localesDir, 'messages.zh-CN'))) fs.renameSync(path.join(localesDir, 'messages.zh-CN'), path.join(localesDir, 'messages.zh_CN'));

  const ALL_LANGUAGES = fs.readdirSync(localesDir);
  const FOREIGN_LANGUAGES = ALL_LANGUAGES.filter(l => l !== 'messages');
  // update foreign 'messages' files if needed
  if (upgradeForeign)
    updateForeignMessages(FOREIGN_LANGUAGES, localesDir);
  // build JSON files
  ALL_LANGUAGES.forEach(fileName => buildJsonTranslationFile(fileName, localesDir, targetDir));
}


// -------------------------------------- FUNCTIONS -------------------------------------- //

function convertJSON_to_messages(jsonText) {
  return Object.entries(JSON.parse(jsonText)).map(([key, value]) => `${key}=${value.message}`).join('\n')   // NOTE: use this when someone sends you translated JSON file
}

function buildJsonTranslationFile(fileName, localesDir, targetDir) {
  const originalFilePath = path.join(localesDir, fileName);
  const extension = path.extname(fileName).slice(1);
  const isForeign = !!extension;  // foreign messages.xx files has always extension
  const targetFilePath = path.join(targetDir, extension || 'en', 'messages.json');
  const code = fs.readFileSync(originalFilePath, 'utf8');
  const translatedJson = translateMessagesToJson(code, isForeign);
  if (Object.keys(translatedJson).length)
    writeFile(targetFilePath, JSON.stringify(translatedJson));
}

function translateMessagesToJson(stringData, excludeDescriptions) {
  const result = {};
  stringData.split('\n').forEach((line, i, array) => {
    const previousLine = array[i - 1] || '';
    const description = previousLine.startsWith('#') ? previousLine.slice(1).trim() : '';
    let isDescription = line.startsWith('#');
    let isComment = line.startsWith('//');
    const [key, message] = line.split('=').map(x => x.trim());
    // make sure we process only only normal lines with messages and optionally comments above
    if (!key || !message || isDescription || isComment) return;
    result[key] = {message: message};
    if (description && !excludeDescriptions) result[key].description = description;
  });
  return result;
}

function writeFile(filePath, code) {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, code);
}


function updateForeignMessages(foreignFiles, localesDir) {
  // read original 'messages' file
  const messagesFilePath = path.join(localesDir, 'messages');
  const messagesString = fs.readFileSync(messagesFilePath, 'utf8');
  // for each foreign file we first read it and then create JSON file
  foreignFiles.forEach(file => {
    const foreignFilePath = path.join(localesDir, file);
    const foreignFileString = fs.readFileSync(foreignFilePath, 'utf8');
    const translatedJson = translateMessagesToJson(foreignFileString);
    // then we process original 'messages' file and create its copy but we include the existing foreign translations
    const foreignResult = [];
    messagesString.split('\n').forEach((line, i, array) => {
      const previousLine = array[i - 1] || '';
      const description = previousLine.startsWith('#') ? previousLine.slice(1).trim() : '';
      let isDescription = line.startsWith('#');
      let isComment = line.startsWith('//');
      const [key, message] = line.split('=').map(x => x.trim());
      // make sure we process only only normal lines with messages and optionally comments above
      if (isDescription) return;
      if (!key || !message || isComment) return foreignResult.push(line);
      foreignResult.push(`#${Array(key.length).fill(' ').join('')}${message}${description ? `\t\t// ${description}` : ''}`);
      const translatedMessage = ((translatedJson[key] || {}).message || '')
        .replaceAll('&#39;', '\'');
      foreignResult.push(`${key}=${translatedMessage}`);
      // make sure there are NO missing params
      if (translatedMessage && getMissingParams(message, translatedMessage))
        foreignResult.push('// WARNING: TRANSLATION ISSUE MISSING PARAMS');
      // make sure there are NO redundant params
      if (getMissingParams(translatedMessage, message))
        foreignResult.push('// WARNING: TRANSLATION ISSUE REDUNDANT PARAMS')
    });
    writeFile(foreignFilePath, foreignResult.join('\n'));
    function getMissingParams(message, translatedMessage) {
      const result = (message.match(/\$[0-9]/g) || [])
        .map(param => translatedMessage.includes(param) ? [true, param] : [false, param])
        .filter(([isOK, param]) => !isOK)
        .map(([isOK, param]) => param)
        .join(' ');
      return result ? result : '';
    }
  });
}

