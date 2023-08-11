export const parseSearchInput = (input) => {
  return input.replace(/['"\n]/g, '').split(/[\s,]+/);
};
