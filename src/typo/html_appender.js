import {DOMContentLoadedPromise} from "../utils/modules/dom_ready.js";

if (!window._typo_nodes) window._typo_nodes = [];

export async function insertHtml(htmlNode) {
  await DOMContentLoadedPromise;
  window._typo_nodes.push(htmlNode);
  document.body.parentElement.appendChild(htmlNode);
}
