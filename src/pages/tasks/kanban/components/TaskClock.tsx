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
import { isTaskRunning } from '$app/pages/tasks/common/helpers/calculate-entity-state';
import { calculateTime } from '$app/pages/tasks/common/helpers/calculate-time';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import duration from 'dayjs/plugin/duration';
import { useColorScheme } from '$app/common/colors';
import classNames from 'classnames';

dayjs.extend(duration);

interface Props {
  task: Task;
  calculateLastTimeLog?: boolean;
  extraSmallText?: boolean;
}

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export function TaskClock(props: Props) {
  const colors = useColorScheme();

  const [seconds, setSeconds] = useState<number>(0);

  const isTaskActive = props.task && isTaskRunning(props.task);

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  const handleVisibilityChange = () => {
    const calculation = calculateTime(props.task.time_log, {
      inSeconds: true,
      calculateLastTimeLog: Boolean(props.calculateLastTimeLog),
    });

    if (isTaskActive) {
      setSeconds(Number(calculation));

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setSeconds((current) => current + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    const calculation = calculateTime(props.task.time_log, {
      inSeconds: true,
      calculateLastTimeLog: Boolean(props.calculateLastTimeLog),
    });

    if (isTaskActive) {
      setSeconds(Number(calculation));

      intervalRef.current = setInterval(() => {
        setSeconds((current) => current + 1);
      }, 1000);

      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [props.task.updated_at]);

  return (
    <p
      className={classNames('font-mono', {
        'text-xs': props.extraSmallText,
        'text-sm': !props.extraSmallText,
      })}
      style={{ color: colors.$17 }}
    >
      {isTaskActive && formatTime(seconds)}
    </p>
  );
}
