export const parseSearchInput = (input) => input.replace(/['"\n]/g, '').split(/[\s,]+/);
