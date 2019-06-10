
window._typo_nodes = [];
export function insertHtml(htmlNode) {
  window._typo_nodes.push(htmlNode);
  document.body.parentElement.appendChild(htmlNode);
}
