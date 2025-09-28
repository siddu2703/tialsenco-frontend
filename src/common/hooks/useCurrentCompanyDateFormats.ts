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

export function useCurrentCompanyDateFormats() {
  const company = useCurrentCompany();

  const { data: statics } = useStaticsQuery();

  const [dateFormatId, setDateFormatId] = useState('0');
  const [dateFormat, setDateFormat] = useState('DD/MMM/YYYY');

  useEffect(() => {
    if (statics?.date_formats) {
      const result = statics.date_formats.find(
        (format) => format.id === (company?.settings?.date_format_id ?? '0')
      );

      if (result) {
        setDateFormat(result.format_moment);
        setDateFormatId(result.id);
      }
    }
  }, [company, statics]);

  return {
    dateFormatId,
    dateFormat,
  };
}
