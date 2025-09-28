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
import { Client } from '$app/common/interfaces/client';
import { InfoCard } from '$app/components/InfoCard';
import { ClientActionButtons } from '$app/pages/invoices/common/components/ClientActionButtons';
import { useTranslation } from 'react-i18next';

interface Props {
  client: Client;
}

export function ClientCard(props: Props) {
  const [t] = useTranslation();

  const { client } = props;

  const colors = useColorScheme();

  return (
    <>
      {client && (
        <div className="col-span-12 lg:col-span-3 px-4 sm:px-6">
          <InfoCard
            title={t('client')}
            value={<ClientActionButtons displayClientName client={client} />}
            className="h-full"
            style={{ borderColor: colors.$24 }}
          />
        </div>
      )}
    </>
  );
}
