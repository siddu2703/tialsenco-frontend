/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { Client } from '$app/common/interfaces/client';
import { InfoCard } from '$app/components/InfoCard';
import { useTranslation } from 'react-i18next';

interface Props {
  client: Client;
}

export function Standing(props: Props) {
  const { client } = props;

  const [t] = useTranslation();

  const colors = useColorScheme();

  const formatMoney = useFormatMoney();

  return (
    <>
      {client && (
        <InfoCard
          title={t('standing')}
          className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-3 shadow-sm h-full 2xl:h-max p-4"
          style={{ borderColor: colors.$24 }}
          withoutPadding
        >
          <div className="flex flex-col h-44 overflow-y-auto">
            <div
              className="flex justify-between border-b border-dashed pt-1.5 pb-3"
              style={{ borderColor: colors.$24 }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: colors.$17 }}
              >
                {t('paid_to_date')}
              </span>

              <span className="text-sm font-mono">
                {formatMoney(
                  client.paid_to_date,
                  client.country_id,
                  client.settings.currency_id
                )}
              </span>
            </div>

            <div
              className="flex justify-between border-b border-dashed py-3"
              style={{ borderColor: colors.$24 }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: colors.$17 }}
              >
                {t('outstanding')}
              </span>

              <span className="text-sm font-mono">
                {formatMoney(
                  client.balance,
                  client.country_id,
                  client.settings.currency_id
                )}
              </span>
            </div>

            <div
              className="flex justify-between border-b border-dashed py-3"
              style={{ borderColor: colors.$24 }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: colors.$17 }}
              >
                {t('credit_balance')}
              </span>

              <span className="text-sm font-mono">
                {formatMoney(
                  client.credit_balance,
                  client.country_id,
                  client.settings.currency_id
                )}
              </span>
            </div>

            <div
              className="flex justify-between border-b border-dashed py-3"
              style={{ borderColor: colors.$24 }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: colors.$17 }}
              >
                {t('payment_balance')}
              </span>

              <span className="text-sm font-mono">
                {formatMoney(
                  client.payment_balance,
                  client.country_id,
                  client.settings.currency_id
                )}
              </span>
            </div>
          </div>
        </InfoCard>
      )}
    </>
  );
}
