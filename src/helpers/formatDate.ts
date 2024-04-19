import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import 'dayjs/locale/en-gb';

dayjs.locale('en-gb');

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

/**
 * Formats date as relative time.
 * @param date Date to format.
 * @param currentDate Current date to compared against (for testing).
 * @returns Formatted date as relative time (up to two weeks).
 */
const formatDateRelative = (
  date: string,
  currentDate?: string,
): string => {
  let formattedDate;

  const targetDate = dayjs(date);
  const now = dayjs(currentDate ?? undefined);

  if (now.diff(targetDate, 'week') >= 2) {
    formattedDate = targetDate.format('DD/MM/YYYY');
  } else {
    formattedDate = targetDate.from(now);
  }

  return formattedDate;
};

/**
 * Formats date as long format.
 * @param date Date to format.
 * @returns Formatted date as long format.
 */
const formatDateLong = (
  date: string,
): string => dayjs(date).format('LL');

export { formatDateRelative, formatDateLong };
