/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useStaticsQuery } from '$app/common/queries/statics';
import { useEffect, useState } from 'react';
import { useCurrentCompany } from './useCurrentCompany';
import { Timezone } from '../interfaces/statics';

export function useCompanyTimeZone() {
  const company = useCurrentCompany();

  const { data: statics } = useStaticsQuery();

  const [timeZoneId, setTimeZoneId] = useState('1');
  const [timeZone, setTimZone] = useState('America/Tijuana');

  useEffect(() => {
    if (statics?.timezones) {
      const result = statics.timezones.find(
        (currentTimezone: Timezone) =>
          currentTimezone.id === (company?.settings?.timezone_id ?? '1')
      );

      if (result) {
        setTimZone(result.name);
        setTimeZoneId(result.id);
      }
    }
  }, [company, statics]);

  return {
    timeZoneId,
    timeZone,
  };
}
