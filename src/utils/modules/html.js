import {isString, resource} from "./utils_module.js";

export const ICON_48 = '48.png';
export const MAX_Z_INDEX = 2147483647;
export const MIN_Z_INDEX = -2147483648;
export const EMPTY_IMAGE_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const $BROWSER = $IS_FIREFOX ? 'firefox' : 'chrome';


export function removeChildNodes(node) {
  while (node.hasChildNodes())
    node.removeChild(node.lastChild);
}

export function replaceChildNodes(node, nodesList) {
  removeChildNodes(node);
  if (!nodesList) return;                                   // if there is nothing to append, we just clear and exit
  if (!Array.isArray(nodesList)) nodesList = [nodesList];   // upgrade to array
  const fragment = document.createDocumentFragment();
  nodesList.forEach(node => fragment.appendChild(node));
  node.appendChild(fragment);
}

export function createFragment(nodesArray) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < nodesArray.length; i++) fragment.appendChild(nodesArray[i]);
  return fragment;
}

/**
 * NOTE:
 * - event handlers needs to be wrapped under "handlers" key
 * - dataset items like "data-custom-attr" are supported
 */
export function buildElement(name, attrs, childNodesOpt) {
  const node = name === 'svg' || name === 'path' ? document.createElementNS('http://www.w3.org/2000/svg', name) : document.createElement(name);   // SVG requires createElementNS because the default one would lowercase element names
  if (attrs) {
    if (typeof attrs === 'string') attrs = {textContent: attrs};    // allow using text content as second parameter
    Object.entries(attrs).forEach(([key, value]) => {
      switch (key) {
        case 'text':  // falls through
        case 'textContent':
          node[key] = value;
          break;                   // todo: find out why do we use this instead of "setAttribute"
        case 'handlers':
          Object.assign(node, attrs.handlers);
          break;    // event handlers can be set only using `Object.assign` function!
        default:
          node.setAttribute(key, value);
          break;                  // everything else using `setAttribute` function - NOTE: this can handle "data-stuff" AND read-only "width" in SVG nodes!
      }
    });
  }
  if (childNodesOpt) {
    if (!Array.isArray(childNodesOpt)) childNodesOpt = [childNodesOpt];
    childNodesOpt.forEach(childNode => {
      if (childNode) node.appendChild(childNode)
    });
  }
  return node;
}

export function buildFragment(...fragmentBuilders) {
  return createFragment(fragmentBuilders.map(x => buildMessage(x)));
}

export function buildMessage(message) {
  const [a, b, array] = message;
  if (typeof a !== 'string')
    return message.map(item => item && buildMessage(item));
  return buildElement(a, b, array ? buildMessage(array) : null);
}

// WARNING: clicking label will generate TWO "click" events - one for label and one for the nested input! This is a known issue (tested in Firefox and Chrome)
export function labelWithIcon(src, text, iconAttributes = {}, textAttributes = {}) {
  return buildMessage(['label', {style: 'display: flex; align-items: center;'}, [['img', Object.assign({
    src: src,
    height: 14,
    width: 14,
    style: 'margin-right: 5px;'
  }, iconAttributes)], ['span', Object.assign({textContent: text}, textAttributes)]]])
}

export function checkboxWithText(text, value, textAttributes = {}, checkboxAttributes = {}) {
  return buildMessage(['label', {style: 'display: flex; align-items: center;'}, [['input', Object.assign({
    type: 'checkbox',
    style: 'margin-right: 5px;'
  }, value ? {checked: true} : {}, checkboxAttributes)], ['span', Object.assign({textContent: text}, textAttributes)]]])
}

export function buildCheckbox(value, attributes = {}) {
  return buildElement('input', {type: 'checkbox', ...attributes, ...(value ? {checked: true} : {})})
}

export function buildIconCheckbox(value, checkboxAttr = {}, containerAttr = {}, imgAttr = {}, [checkedImg, uncheckedImg]) {
  const checkboxNode = buildElement('input', {type: 'checkbox', ...checkboxAttr, ...(value ? {checked: true} : {})});
  const imgNode = buildElement('img', {...imgAttr});
  const container = buildElement('div', {...containerAttr}, [checkboxNode, imgNode]);
  const onChange = () => imgNode.src = resource(checkboxNode.checked ? checkedImg : uncheckedImg);
  onChange();   // set default value
  checkboxNode.addEventListener('change', onChange);
  Object.defineProperty(container, 'checked', {
    get: () => checkboxNode.checked,
    set: val => {
      checkboxNode.checked = val;
      onChange();
    }   // the onChange here is redundant when user click it, BUT we need it if it's changed by javascript!
  });
  return container;
}

export const getNode = nodeOrId => isString(nodeOrId) ? byId(nodeOrId) : nodeOrId;

export function replaceNode(targetNodeOrId, createNodeFn) {
  const targetNode = getNode(targetNodeOrId);
  targetNode.insertAdjacentElement('afterend', createNodeFn(targetNode));
  targetNode.remove();
}

export function copyNodeStyle(sourceNode, targetNode) {
  const computedStyle = window.getComputedStyle(sourceNode);
  Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
}// different hiding of node using 'visibility' style
export const byId = id => document.getElementById(id);
export const byClass = (node, className) => node.getElementsByClassName(className)[0];
export const removeNode = node => node.remove();
export const findNodeIndex = (nodes, node) => {
  for (let i = 0; i < nodes.length; i++) if (nodes[i].isSameNode(node)) return i
};
export const stripHtml = htmlString => new DOMParser().parseFromString(htmlString, 'text/html').body.textContent || '';
export const setStyle = (node, style, value) => node.style.setProperty(style, value, 'important');
export const hideNode = node => {
  if (node) node.style.display = 'none'
};
export const showNode = (node, inlineBlock = false) => {
  if (node) node.style.display = inlineBlock ? 'inline-block' : 'block'
};
export const isVisibleNode = node => node.style.display !== 'none' && node.style.visibility !== 'hidden';
export const makeInvisible = node => {
  node.style.visibility = 'hidden'
};
export const makeVisible = node => {
  node.style.visibility = 'visible'
};
export const makeVisibleFor = (node, time = 1500) => {
  makeVisible(node);
  setTimeout(makeInvisible, time, node)
};

export function commonHtmlPostProcessing() {
  document.querySelectorAll('[data-show-if]').forEach(async node => {
    const data = node.getAttribute('data-show-if');
    const NOT = data.startsWith('!');
    const value = NOT ? data.slice(1) : data;
    switch (value) {
      case 'firefox':
      case 'chrome':
        if (!NOT && $BROWSER !== value || NOT && $BROWSER === value) node.className = 'hidden';
        break;
      case 'mac':
      case 'win':
      case 'android':
      case 'cros':
      case 'linux':
      case 'openbsd':
        const {os} = await browser.runtime.getPlatformInfo();
        if (!NOT && os !== value || NOT && os === value) node.className = 'hidden';
        break;
    }
  });
}

export function selectAll(node) {
  node = node.isCustomField ? node.node : node;
  node.focus();
  if (['text', 'search', 'URL', 'tel', 'password'].includes(node.type))   // only these are selectable    // https://developer.mozilla.org/docs/Web/API/HTMLInputElement/setSelectionRange
    node.setSelectionRange(0, node.value.length)
}

// https://developer.mozilla.org/docs/Web/API/Selection
export const getSelectedText = () => window.getSelection().toString();
// Styles:
export const ELLIPSIS_TRIO = `overflow: hidden; white-space: nowrap; text-overflow: ellipsis;`;
export const USER_SELECT_TRIO = `-webkit-user-select: none; -moz-user-select: none; user-select: none;`;


