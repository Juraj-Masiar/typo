import {buildElement} from "../utils/modules/html.js";

export const InputController = (() => {
  const _listeners = [];
  const _escListeners = [];
  const _node = buildElement('input', {style: styleNode(`
  position: fixed; 
  top: 0; 
  left: 0; 
  margin: 10px; 
  font-size: 20px; 
  background: white; 
  border: 1px solid black;
  `)});
  const _fakeNode = buildElement('input', {style: styleNode('opacity: 0; position: fixed; top: 0; left: 0;')});
  let _nodeToFocus = _node, _stealingFocus = false;
  setInterval(() => {if (_stealingFocus) _nodeToFocus.focus() }, 10);    // automatic focusing of typing node
  _node.oninput = inputChangeHandler;
  // _node.onkeydown = onKeyDown;
  window.addEventListener('keydown', onKeyDown);
  document.body.appendChild(_node);
  document.body.appendChild(_fakeNode);

  let _self;
  return (_self = {
    clear: () => _node.value = '',
    stealFocus: () => _stealingFocus = true,
    returnFocus: () => _stealingFocus = false,
    addListener: fn => _listeners.push(fn),
    addOnEscHandler: fn => _escListeners.push(fn),
    disableTyping: disableTyping,
    enableTyping: enableTyping,
  });

  function enableTyping() {   // todo: this is very badly implemented, we
    _nodeToFocus = _node;
    return _node.disabled = false;
  }

  function disableTyping() {
    _nodeToFocus = _fakeNode;   // when we disable input, then we won't be receiving any onKeyDown events, so we need to focus something else - in this case fake invisible input
    return _node.disabled = true;
  }

  function inputChangeHandler(e) {
    const text = e.target.value;
    _listeners.forEach(fn => fn(text, _self))
  }

  function onKeyDown(e) {
    if (e.code === 'Escape') _escListeners.forEach(fn => fn(e));
  }

})();

