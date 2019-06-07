export const noop = () => {};
export const orEmpty = item => item || {};
export const negateFn = fn => (...params) => !fn(...params);
export const negateAsyncFn = fn => async (...params) => !(await fn(...params));
export const oc = (expressionFn, defaultValue) => { try { return expressionFn(); } catch(e) { return defaultValue } };
export const tryExpression = (expressionFn, catchFn) => { try { return expressionFn(); } catch(e) { return catchFn(e) } };
export const and = (...functions) => (...params) => functions.every(fn => fn.apply(null, params));
export const andAsync = (...functions) => async (...params) => (await Promise.all(functions.map(fn => fn(...params)))).every(isTrue);
export const orAsync = (...functions) => async (...params) => (await Promise.all(functions.map(fn => fn(...params)))).some(isTrue);
export const isDefined = value => typeof value !== 'undefined';
export const isString = value => typeof value === 'string';
export const isObject = value => value !== null && typeof value === 'object';
export const isBoolean = value => typeof value === 'boolean';
export const isFunction = fn => typeof fn === 'function';
export const isNumber = value => !isNaN(value - parseFloat(value));    // https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
export const isBlank = str => (!str || /^\s*$/.test(str));
export const printNumber = number => (Object.is(number, -0) ? '-' : '') + number;    // can print negative zero
export const getTime = () => new Date().getTime();
export const isStillValid = (dateTime, validDuration) => getTime() < dateTime + validDuration;

export const secondsToMs = seconds => seconds * 1000;
export const minutesToMs = minutes => minutes * 60000;
export const hoursToMs = hours => hours * 3600000;
export const daysToMs = days => days * 86400000;

export const isTrue = x => x;
export const execute = fn => fn();
export const executeAllAndClear = (array, params = []) => { let fn; while ((fn = array.pop())) fn.apply(null, params); };
export const subtractObjects = (oA, oB) => Object.keys(oA).reduce((acc, key) => (acc[key] = oA[key] - oB[key], acc), {});
export const flipBooleanInObject = (obj, key, {deleteFalse} = {}) => (obj[key] = !obj[key], deleteFalse && !obj[key] && delete obj[key], obj);
export const px = pixels => `${pixels}px`;
export const percent = percent => `${percent}%`;
export const quote = item => `"${item}"`;

export const copyObject = objToClone => Object.assign({}, objToClone);
export const copyObjectDeepAsync = obj => new Promise(resolve => { const {port1, port2} = new MessageChannel(); port2.onmessage = ev => resolve(ev.data); port1.postMessage(obj); });
export const mapToObject = map => [...map.entries()].reduce((acc, [key, value]) => (acc[key] = value, acc), {});

export const isInIframe = () => { try { return window.self !== window.top } catch (e) { return true } };
// based on the real life experiments!

// events:
export const onlyMeEventHandler = fn => e => {e.preventDefault(); e.stopImmediatePropagation(); fn(e); };

export const resource = path => browser.extension.getURL(path);

export function substring(input, strStart, strEnd, useFullLengthInCaseEndNotFound) {
  let x = 0, z = 0, y = input.length;
  if (strStart) x = (z = input.indexOf(strStart)) + strStart.length;
  if (strEnd) y = input.indexOf(strEnd, x);
  if (y < 0 && useFullLengthInCaseEndNotFound) y = input.length;
  return y < 0 || z < 0 ? '' : input.substring(x, y);
}

// WARNING: chrome UUID is piece of shit!@
export const getUUID = () => {
  const uuid = substring(browser.extension.getURL(''), '://', '/', true);
  if ($IS_FIREFOX) return uuid;
  else {
    const x = uuid.split('').map(c => (c.charCodeAt(0) % 16).toString(16)).join('');
    return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`
  }
};

export const getNameVersion = () => {const m = browser.runtime.getManifest(); return `${m.name} ${m.version}`};

export const errorToString = (message, error) => `${message}: ${isObject(error) ? `${error.name}\n${error.message}\n${error.stack}\n${error}` : 'N/A'}`;

export const orderByFactory = (property, asc = true) => asc ? (a, b) => a[property] - b[property] : (a, b) => b[property] - a[property];
export const orderByMultipleFactory = (fields) => (a, b) => fields.reduce((acc, {name, asc = true, compareFn}) => acc || (compareFn ? compareFn(a, b) : (isString(a[name]) ? (asc ? a[name].localeCompare(b[name]) : b[name].localeCompare(a[name])) : (asc ? a[name] - b[name] : b[name] - a[name]))), 0);

export const rejectedPromise = errorMessage => Promise.reject(Error(errorMessage));
export const sideEffectHandler = fn => (item => { fn(item); return item; });   // returns new one-param function that will call the side-effect function and then return original value; Useful for `.map` or `.then` functions.
export const sideEffectPromiseHandler = fn => (item => fn(item).then(() => item));
export const sideEffectRejectHandler = fn => (err => (fn(err), Promise.reject(err)));

// const stackTrace = () => new Error().stack;
// const makeDirty = obj => obj.__isDirty = getTime();
export const sum = (...items) => items.reduce((a, b) => a + b, 0);
export const removeFromObject = (obj, ...keys) => keys.forEach(key => delete obj[key]);

export const randomItem = array => array[Math.floor(Math.random() * array.length)];

export const timeoutPromise = delay => new Promise(resolve => setTimeout(resolve, delay));
export const promiseFactory = () => { const result = []; result.splice(0, 0, new Promise((resolve, reject) => {result.push(resolve, reject)})); return result };   // returns [promise, resolve, reject]

export const extractHexColor = node => (window.getComputedStyle(node)['background-color'].match(/[0-9]+/g) || ['0','0','0','0']).slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
export const extractHoursMinutesSeconds = seconds => seconds ? [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), (seconds % 60)] : [0, 0, 0];

export const mapGetAndRemove = (map, key) => { const result = map.get(key); map.delete(key); return result; };

export const getParentAtLevel = (node, parentLevelCount) => { for (let i = 0; i < parentLevelCount; i++) {node = node.parentNode} return node; };

export const isRunningInBackground = () => window.location.href === browser.runtime.getManifest().background.page;
export const ifFirefoxVersion = version => FIREFOX_VERSION_PROMISE().then(firefoxVersion => firefoxVersion >= version ? Promise.resolve(firefoxVersion) : Promise.reject(new Error('old FF')));
export const getChromeVersion = () => { try { return $IS_CHROME && parseInt(/Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1]) } catch (e) { return 0 }};
export const IS_OPERA_FN = () => navigator.userAgent.indexOf(' OPR/') >= 0;
export const IS_VIVALDI_FN = () => navigator.userAgent.indexOf(' Vivaldi/') >= 0;
export const IS_ANDROID_FN = () => browser.runtime.getPlatformInfo && browser.runtime.getPlatformInfo().then(({os}) => os === 'android');

export const closeCurrentTab = () => browser.tabs.getCurrent().then(tab => browser.tabs.remove(tab.id));
export const queryTabInfo = () => Promise.all([browser.tabs.getCurrent(), browser.windows && browser.windows.getCurrent()]);
export const sendMessageToCurrentTab = message => browser.tabs.query({currentWindow: true, active: true}).then(tabs => browser.tabs.sendMessage(tabs[0].id, message));
export const getActiveTab = () => browser.tabs.query({active: true, lastFocusedWindow: true}).then(([tab]) => tab);
export const getCurrentTabId = () => browser.tabs.getCurrent().then(tab => tab.id);
export const reloadAddonAndTab = async () => { browser.tabs.reload((await getActiveTab()).id); browser.runtime.reload(); };    // used for development
export const closeOrUpdateCurrentTab = alternativeURL => browser.tabs.query({}).then(tabs => tabs.length === 1 ? browser.tabs.update({url: alternativeURL}) : browser.tabs.getCurrent().then(tab => browser.tabs.remove(tab.id)));

// CONSTANTS:
export const FIREFOX_VERSION_PROMISE = () => $IS_FIREFOX ? browser.runtime.getBrowserInfo().then(info => parseInt(info.version)) : Promise.reject(new Error('not FF'));
export const NULL = 0;   // used in DB for missing values
// this works in Firefox and Chrome     NOTE: Chrome has separate incognito background process as well!!!



// --------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------------------------- //
// -------------------------------------------- FACTORIES -------------------------------------------- //

export const OneTimeFactory = fn => {
  let IS_OVER = false;
  return function (/* arguments */) {
    if (IS_OVER) return;              // make sure we cannot call this twice!
    IS_OVER = true;
    fn.apply(null, arguments)
  };
};

// Takes a function that can be evaluated only once. Returned function can be called multiple times, first calls the passed function, every other call will return the previous value.
export const LazyValFunction = fn => {
  let IS_OVER = false, result;
  return (...params) => {
    if (IS_OVER) return result;
    IS_OVER = true;
    return result = fn(...params)
  };
};

export async function openURL(url, inNewTab, nextToCurrent, active, inNewWindow, forceIncognitoWindow) {
  if (inNewTab) {
    if (nextToCurrent) return getActiveTab().then(tab => browser.tabs.create({url: url, active: !!active, index: tab.index + 1}));
    else return browser.tabs.create({url: url, active: !!active});
  }
  else if (inNewWindow) return browser.windows.create(Object.assign({url: url}, forceIncognitoWindow ? {incognito: true} : {}));
  else return browser.tabs.update({url: url});
}

export async function executePromisesSync(arrayOfFn, beforeEachFn = noop, afterEachFn = noop) {
  const result = [];
  for (let i = 0; i < arrayOfFn.length; i++) {
    beforeEachFn(i);
    const promiseResult = await arrayOfFn[i]();
    result.push(promiseResult);
    afterEachFn(i, promiseResult);
  }
  return result
}


export const NumberGenerator = (() => {
  let i = 0;
  return () => ++i;
})();



export const requestAnimationFramePromise = () => new Promise(resolve => window.requestAnimationFrame(resolve));
