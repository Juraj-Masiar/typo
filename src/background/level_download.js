import {HOST_TYPO} from "../modules/hosts.js";


export const LevelDownload = (() => {
  return {
    getLevel: getLevel
  };

  async function getLevel(levelNumber) {
    const level = await (await fetch(`${HOST_TYPO}api/level_${levelNumber}`)).json();
    return level;
  }
})();