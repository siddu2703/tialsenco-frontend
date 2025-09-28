/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Task } from '$app/common/interfaces/task';
import { parseTimeLog } from './calculate-time';

export function isOverlapping(task: Task) {
  let overlaps = false;

  const logs = parseTimeLog(task.time_log);
  const sorted = logs.sort((a, b) => a[0] - b[0]);

  let numberOfStartedLogs = 0;

  sorted.forEach(([start, stop], index) => {
    const next = sorted[index + 1];

    if (stop == 0 && next) {
      overlaps = true;
    }

    if (next && stop > next[0]) {
      overlaps = true;
    }

    if (stop !== 0 && start > stop) {
      overlaps = true;
    }

    if (stop === 0) {
      numberOfStartedLogs++;
    }

    if (numberOfStartedLogs > 1) {
      overlaps = true;
    }
  });

  return overlaps;
}
