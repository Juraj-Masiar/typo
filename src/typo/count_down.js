import {buildElement} from "../utils/modules/html.js";
import {styleNode} from "../modules/common.js";
import {insertHtml} from "./html_appender.js";
import {timeoutPromise} from "../utils/modules/utils_module.js";

export async function contDown(fromNumber, {} = {}) {
  const node = buildElement('b', {style: styleNode(`
  font-size: 256px;
  position: absolute;
  color: darkgreen;
  left: 50%;
  top: 50%;
  font-weight: bold;
  `)});
  await insertHtml(node);
  do {
    node.textContent = fromNumber;
    await timeoutPromise(1000);
  } while (--fromNumber > 0);
  node.remove();
}
