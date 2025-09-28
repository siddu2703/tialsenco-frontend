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
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { EmailRecord as EmailRecordType } from '$app/common/interfaces/email-history';
import { Card } from '$app/components/cards';
import { EmailRecord } from '$app/components/EmailRecord';
import { ChevronDown } from '$app/components/icons/ChevronDown';
import { ChevronUp } from '$app/components/icons/ChevronUp';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export function EmailHistory() {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const queryClient = useQueryClient();

  const { id } = useParams();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [emailRecords, setEmailRecords] = useState<EmailRecordType[]>([]);

  const fetchEmailHistory = async () => {
    const response = await queryClient.fetchQuery(
      ['/api/v1/clients', id, 'emailHistory'],
      () =>
        request(
          'POST',
          endpoint('/api/v1/emails/clientHistory/:id', { id })
        ).then((response) => response.data),
      { staleTime: Infinity }
    );

    setEmailRecords(response);
  };

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  return (
    <>
      {Boolean(emailRecords.length) && (
        <Card
          title={t('email_history')}
          className="h-full 2xl:h-max col-span-12 lg:col-span-6 xl:col-span-5 2xl:col-span-4 shadow-sm p-4"
          style={{ borderColor: colors.$24 }}
          withoutBodyPadding
          withoutHeaderPadding
          withoutHeaderBorder
          headerClassName={classNames({ 'pb-2': isExpanded })}
          topRight={
            <div
              className="cursor-pointer"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? (
                <ChevronUp color={colors.$3} size="1.2rem" strokeWidth="2" />
              ) : (
                <ChevronDown color={colors.$3} size="1.2rem" strokeWidth="2" />
              )}
            </div>
          }
        >
          {isExpanded && (
            <div className="flex flex-col pt-1 h-44 overflow-y-auto">
              {emailRecords.map(
                (emailRecord, index) =>
                  emailRecord && (
                    <EmailRecord
                      key={index}
                      emailRecord={emailRecord}
                      index={index}
                      withBottomBorder
                      withEntityNavigationIcon
                    />
                  )
              )}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
