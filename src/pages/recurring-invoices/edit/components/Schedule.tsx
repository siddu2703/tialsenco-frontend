/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date, endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { Card } from '$app/components/cards';
import { Spinner } from '$app/components/Spinner';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { RecurringInvoiceContext } from '../../create/Create';
import { useOutletContext } from 'react-router-dom';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { useColorScheme } from '$app/common/colors';

export default function Schedule() {
  const [t] = useTranslation();

  const context: RecurringInvoiceContext = useOutletContext();
  const { recurringInvoice } = context;

  const colors = useColorScheme();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const { data: resource, isLoading } = useQuery({
    queryKey: ['/api/v1/recurring_invoices', recurringInvoice?.id, 'slider'],
    queryFn: () =>
      request(
        'GET',
        endpoint(
          '/api/v1/recurring_invoices/:id?include=activities.history&show_dates=true',
          { id: recurringInvoice?.id }
        )
      ).then(
        (response: GenericSingleResourceResponse<RecurringInvoice>) =>
          response.data.data
      ),
    enabled: Boolean(recurringInvoice?.id),
    staleTime: Infinity,
  });

  return (
    <Card
      title={t('schedule')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
      withoutBodyPadding
    >
      <div className="flex w-full justify-center pb-6 pt-4">
        <div className="flex flex-col w-full lg:w-3/4">
          {isLoading && <Spinner />}

          {!isLoading && (
            <div className="flex flex-1 px-6 pt-2 pb-3 font-medium text-sm">
              <span className="w-1/2">{t('send_date')}</span>
              <span className="w-1/2">{t('due_date')}</span>
            </div>
          )}

          {resource?.recurring_dates.map((recurringDate, index) => (
            <div key={index} className="flex flex-1 px-6 py-2 text-sm">
              <span className="w-1/2">
                {date(recurringDate.send_date, dateFormat)}
              </span>
              <span className="w-1/2">
                {date(recurringDate.due_date, dateFormat)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
