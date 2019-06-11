export const requestAnimationFramePromise = () => new Promise(resolve => window.requestAnimationFrame(resolve));
export const flatten = arrayOfArrays => Array.prototype.concat.apply([], arrayOfArrays);
export const shuffleArray = array => array.map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x);
export const setStyle = (node, style, value) => node.style.setProperty(style, value, 'important');
export const styleNode = (styles = '') => (`all: initial; z-index: 2147483647; font-family: Verdana, Helvetica, sans-serif; font-size: 12px; ${styles}`).split(';').filter(x => x.trim()).map(s => s + '!important').join(';');
export const styleBlock = (styles = '') => (`all: initial; z-index: 2147483647; font-family: Verdana, Helvetica, sans-serif; font-size: 12px; display: block; ${styles}`).split(';').filter(x => x.trim()).map(s => s + '!important').join(';');
export const styleTr = (s = '') => styleNode(`display: table-row;${s}`);
export const styleTd = (s = '') => styleNode(`display: table-cell;${s}`);


export const removeFromArrayPredicate = (arr, fn) => { for(let i = arr.length; i--;) if(fn(arr[i])) arr.splice(i, 1) };

export {buildMessage as buildHtml} from "../utils/modules/html.js";
