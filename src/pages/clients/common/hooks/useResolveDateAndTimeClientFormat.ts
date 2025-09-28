/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useResolveDateFormat } from '$app/common/helpers/dates/date-format-resolver';
import { useClientResolver } from '$app/common/hooks/clients/useClientResolver';
import { useCompanyTimeFormat } from '$app/common/hooks/useCompanyTimeFormat';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Client } from '$app/common/interfaces/client';

export function useResolveDateAndTimeClientFormat() {
  const company = useCurrentCompany();
  const clientResolver = useClientResolver();
  const { timeFormat } = useCompanyTimeFormat();

  const resolveDateFormat = useResolveDateFormat();

  return async (relationId: string) => {
    const dateFormat = resolveDateFormat(company?.settings.date_format_id);

    const dateTimeFormats = {
      dateFormat,
      timeFormat: timeFormat,
    };

    if (relationId.length >= 1) {
      await clientResolver.find(relationId).then((client: Client) => {
        if (client.settings.date_format_id) {
          dateTimeFormats.dateFormat = resolveDateFormat(
            client.settings.date_format_id
          );
        }

        dateTimeFormats.timeFormat = timeFormat;
      });
    }

    return dateTimeFormats;
  };
}
