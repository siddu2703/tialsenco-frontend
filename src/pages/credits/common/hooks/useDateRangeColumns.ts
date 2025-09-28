/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { DateRangeColumn } from '$app/components/DataTable';

export function useDateRangeColumns() {
  const columns: DateRangeColumn[] = [
    { column: 'date', queryParameterKey: 'date_range' },
    { column: 'due_date', queryParameterKey: 'due_date_range' },
  ];

  return columns;
}
