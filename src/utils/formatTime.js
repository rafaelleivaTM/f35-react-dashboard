import { format, formatDistanceToNow, getTime } from "date-fns";

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function getDateFormatted(date = null) {
  const fm = 'yyyy-MM-dd';

  return date ? format(new Date(date), fm) : format(new Date(), fm);
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export const addOneDay = (strDate) => {
  // return the strdate in the same format with one day added
  const date = new Date(strDate);
  date.setDate(date.getDate() + 1);
  return getDateFormatted(date);
};
