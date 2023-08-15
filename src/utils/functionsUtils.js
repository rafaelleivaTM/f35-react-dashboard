export const parseSearchInput = (input) => input.replace(/['"\n]/g, '').split(/[\s,]+/);

export const getAbbreviation = (str, maxLength = 3) => {
  let abbreviation = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
      abbreviation += str[i];
      if (abbreviation.length === maxLength) {
        break;
      }
    }
  }
  if (abbreviation.length === 0) {
    abbreviation = str.slice(0, maxLength);
  } else if (abbreviation.length === 1 && abbreviation[0] === str[0]) {
    abbreviation = str.slice(0, maxLength);
  }
  return abbreviation;
};
