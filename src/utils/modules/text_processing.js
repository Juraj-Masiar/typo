
export const padStart = (number, maxLength = 2, fillStart = '0') => `${number}`.padStart(2, '0');

export const removeDiacritics = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const capitalizeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);

export const escapeRegExp = str => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
