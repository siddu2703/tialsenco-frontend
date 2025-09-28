/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date, endpoint, trans } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { GenericManyResponse } from '$app/common/interfaces/generic-many-response';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { Card } from '$app/components/cards';
import { Spinner } from '$app/components/Spinner';
import { Link } from '$app/components/forms';
import { route } from '$app/common/helpers/route';
import { PurchaseOrderActivity } from '$app/common/interfaces/purchase-order-activity';
import reactStringReplace from 'react-string-replace';
import { useCompanyTimeFormat } from '$app/common/hooks/useCompanyTimeFormat';
import styled from 'styled-components';
import { useColorScheme } from '$app/common/colors';
import classNames from 'classnames';
import { SquareActivityChart } from '$app/components/icons/SquareActivityChart';

const Box = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};

  &:hover {
    background-color: ${(props) => props.theme.hoverBackgroundColor};
  }
`;

export function useGenerateActivityElement() {
  const [t] = useTranslation();

  return (activity: PurchaseOrderActivity) => {
    let text = trans(`activity_${activity.activity_type_id}`, {});

    const replacements = {
      client: (
        <Link to={route('/clients/:id', { id: activity.client?.hashed_id })}>
          {activity.client?.label}
        </Link>
      ),

      user: activity.user?.label ?? t('system'),

      invoice: (
        <Link
          to={route('/invoices/:id/edit', {
            id: activity.invoice?.hashed_id,
          })}
        >
          {activity?.invoice?.label}
        </Link>
      ),

      recurring_invoice: (
        <Link
          to={route('/recurring_invoices/:id/edit', {
            id: activity?.recurring_invoice?.hashed_id,
          })}
        >
          {activity?.recurring_invoice?.label}
        </Link>
      ),

      contact: (
        <Link
          to={route('/clients/:id/edit', {
            id: activity?.contact?.hashed_id,
          })}
        >
          {activity?.contact?.label}
        </Link>
      ),

      notes: activity?.notes && (
        <>
          <br />

          {activity?.notes}
        </>
      ),

      payment_amount: activity?.payment_amount?.label,

      payment: (
        <Link
          to={route('/payments/:id/edit', { id: activity?.payment?.hashed_id })}
        >
          {activity?.payment?.label}
        </Link>
      ),

      purchase_order: (
        <Link
          to={route('/purchase_orders/:id/edit', {
            id: activity?.purchase_order?.hashed_id,
          })}
        >
          {activity?.purchase_order?.label}
        </Link>
      ),
    };

    for (const [variable, value] of Object.entries(replacements)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      text = reactStringReplace(text, `:${variable}`, () => value);
    }

    return text;
  };
}

export default function Activities() {
  const [t] = useTranslation();

  const { id } = useParams();
  const colors = useColorScheme();

  const activityElement = useGenerateActivityElement();

  const { timeFormat } = useCompanyTimeFormat();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/v1/activities/entity', id],
    queryFn: () =>
      request('POST', endpoint('/api/v1/activities/entity'), {
        entity: 'purchase_order',
        entity_id: id,
      }).then(
        (response: AxiosResponse<GenericManyResponse<PurchaseOrderActivity>>) =>
          response.data.data
      ),
    enabled: Boolean(id),
    staleTime: Infinity,
  });

  return (
    <Card
      title={t('activity')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
      withoutBodyPadding
    >
      <div
        className={classNames('w-full px-2 pt-2', {
          'pb-10': activities && activities.length,
          'pb-6': !activities || !activities.length,
        })}
      >
        {isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}

        {activities && !activities.length && (
          <div className="px-3 pt-3 text-sm">{t('api_404')}</div>
        )}

        <div className="flex flex-col w-full">
          {activities?.map((activity) => (
            <Box
              key={activity.id}
              className="flex space-x-3 p-4 rounded-md flex-1 min-w-0 w-full"
              theme={{
                backgroundColor: colors.$1,
                hoverBackgroundColor: colors.$25,
              }}
            >
              <div className="flex items-center justify-center">
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: colors.$20 }}
                >
                  <SquareActivityChart
                    size="1.3rem"
                    color={colors.$16}
                    filledColor={colors.$16}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
                <div className="text-sm" style={{ color: colors.$3 }}>
                  {activityElement(activity)}
                </div>

                <div
                  className="flex w-full items-center space-x-1 text-xs truncate"
                  style={{ color: colors.$17 }}
                >
                  <span className="whitespace-nowrap">
                    {date(activity.created_at, `${dateFormat} ${timeFormat}`)}
                  </span>

                  <span>-</span>

                  <span>{activity.ip}</span>
                </div>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </Card>
  );
}
