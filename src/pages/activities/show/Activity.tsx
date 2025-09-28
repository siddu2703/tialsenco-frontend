/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { Button } from '$app/components/forms';
import { Default } from '$app/components/layouts/Default';
import { InvoiceViewer } from '$app/pages/invoices/common/components/InvoiceViewer';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export default function Activity() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();

  return (
    <Default
      title={t('activity')}
      breadcrumbs={[]}
      navigationTopRight={
        <Button behavior="button" type="secondary" onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
      }
    >
      <InvoiceViewer
        link={endpoint(`/api/v1/activities/download_entity/${id}`)}
        method="GET"
      />
    </Default>
  );
}
