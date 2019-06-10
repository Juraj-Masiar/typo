import {oc} from "./utils_module.js";


export const insertBetweenArray = (array, item) => {
  if (array.length < 2) return array;
  let i = array.length - 1;
  do {
    array.splice(i, 0, item)
  } while (i-- > 1);
  return array
};

export const replaceItemsInArray = (targetArray, newItems) => {
  targetArray.length = 0;
  targetArray.push(...newItems);
  return targetArray;
};

export const findFirst = (array, predicate) => {
  for (let i = 0; i < array.length; i++) if (predicate(array[i])) return array[i]
};

export const findFirstIndex = (array, predicate) => {
  for (let i = 0; i < array.length; i++) if (predicate(array[i])) return i
};

export const removeConsecutiveItemsFromArray = (array, predicateAreSameFn) => array.filter((item, i) => i === 0 || !oc(() => predicateAreSameFn(array[i - 1], item)));

export const removeWhile = (array, predicateFn) => {
  for (let i = 0; i < array.length; i++) if (!predicateFn(array[i])) return array.slice(i);
};

export const removeWhileRight = (array, predicateFn) => removeWhile(array.reverse(), predicateFn).reverse();

export const trimArray = (array, predicateFn) => removeWhile(removeWhileRight(array, predicateFn), predicateFn);

export const removeOneFromArray = (array, predicate) => {
  for (let i = 0; i < array.length; i++) if (predicate(array[i])) return array.splice(i, 1)
};

export const removeFromArray = (arr, item) => {
  for (let i = arr.length; i--;) if (arr[i] === item) arr.splice(i, 1)
};

export const flatten = arrayOfArrays => Array.prototype.concat.apply([], arrayOfArrays);

export const uniqueArray = array => [...new Set(array)];


export function arraySwap(array, i, j) {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}


export function arrayMoveItem(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0]);
  return array;
}