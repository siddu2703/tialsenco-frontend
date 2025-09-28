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
import { sanitizeHTML } from '$app/common/helpers/html-string';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { Client } from '$app/common/interfaces/client';
import { InfoCard } from '$app/components/InfoCard';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  client: Client;
}

export function ClientPrivateNotes(props: Props) {
  const [t] = useTranslation();

  const { client } = props;

  const colors = useColorScheme();
  const reactSettings = useReactSettings();

  return (
    <>
      {Boolean(client && client.private_notes) && (
        <InfoCard
          title={t('private_notes')}
          className="h-full 2xl:h-max col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-3 shadow-sm p-4"
          style={{ borderColor: colors.$24 }}
          withoutPadding
        >
          <div className="whitespace-normal h-44 overflow-y-auto pt-1">
            <article
              className={classNames('prose prose-sm', {
                'prose-invert': reactSettings?.dark_mode,
              })}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(client.private_notes),
              }}
            />
          </div>
        </InfoCard>
      )}
    </>
  );
}
