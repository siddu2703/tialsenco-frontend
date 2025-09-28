/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function useGenerateWeekDateRange() {
  return (startDate: Date, endDate: Date) => {
    const start = dayjs.utc(startDate);
    const end = dayjs.utc(endDate);
    const dates = [];

    let currentDate = start.clone();

    const formattedEndDate = dayjs.utc(end).format('YYYY-MM-DD');

    while (
      currentDate.isBefore(formattedEndDate, 'day') ||
      currentDate.isSame(formattedEndDate, 'day')
    ) {
      if (currentDate.isSame(start, 'day')) {
        dates.push(start.toDate());
      }

      dates.push(currentDate.endOf('week').toDate());
      currentDate = currentDate.add(1, 'week');
    }

    const lengthOfDates = dates.length;

    if (dayjs.utc(dates[lengthOfDates - 1]).isAfter(formattedEndDate, 'day')) {
      dates[lengthOfDates - 1] = end.toDate();
    }

    if (dayjs.utc(dates[lengthOfDates - 1]).isBefore(formattedEndDate, 'day')) {
      dates.push(end.toDate());
    }

    return dates;
  };
}
