/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Timezone } from '../interfaces/statics';
import { useStaticsQuery } from '../queries/statics';

export function useGetTimezone() {
  const { data: statics } = useStaticsQuery();

  return (timeZoneId: string | undefined) => {
    if (statics?.timezones && timeZoneId) {
      const result = statics.timezones.find(
        (currentTimezone: Timezone) => currentTimezone.id === timeZoneId
      );

      if (result) {
        return {
          timeZoneId: result.id,
          timeZone: result.name,
        };
      }
    }

    return {
      timeZoneId: '32',
      timeZone: 'Europe/Lisbon',
    };
  };
}
