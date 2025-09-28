/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { Mailer } from '$app/pages/invoices/email/components/Mailer';
import { MailerComponent } from '$app/pages/purchase-orders/email/Email';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCreditQuery } from '../common/queries';

export default function Email() {
  const [t] = useTranslation();

  const { documentTitle } = useTitle('email_credit');
  const { id } = useParams();

  const { data: credit } = useCreditQuery({ id: id! });

  const mailerRef = useRef<MailerComponent>(null);

  const list = {
    email_template_credit: 'initial_email',
  };

  const pages: Page[] = [
    { name: t('credits'), href: '/credits' },
    {
      name: t('email_credit'),
      href: route('/credits/:id/email', { id }),
    },
  ];

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      saveButtonLabel={t('send_email')}
      onSaveClick={() => mailerRef?.current?.sendEmail()}
    >
      {credit && (
        <Mailer
          ref={mailerRef}
          resource={credit}
          resourceType="credit"
          list={list}
          defaultEmail="email_template_credit"
          redirectUrl={route('/clients/:id/credits', { id: credit.client_id })}
        />
      )}
    </Default>
  );
}
