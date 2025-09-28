/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Subscription } from '$app/common/interfaces/subscription';
import { CopyToClipboardIconOnly } from '$app/components/CopyToClipBoardIconOnly';
import { DataTableColumns } from '$app/components/DataTable';
import { Link } from '$app/components/forms';
import { useTranslation } from 'react-i18next';

export const useSubscriptionColumns = () => {
  const [t] = useTranslation();

  const formatMoney = useFormatMoney();

  const company = useCurrentCompany();

  const columns: DataTableColumns<Subscription> = [
    {
      id: 'name',
      label: t('name'),
    },
    {
      id: 'price',
      label: t('price'),
      format: (value) =>
        formatMoney(
          value,
          company?.settings.country_id,
          company?.settings.currency_id
        ),
    },
    {
      id: 'purchase_page',
      label: t('purchase_page'),
      format: (value) => (
        <div
          className="flex space-x-2"
          onClick={(event) => event.stopPropagation()}
        >
          <Link to={value as string} external>
            {t('purchase_page')}
          </Link>

          <CopyToClipboardIconOnly text={value as string} />
        </div>
      ),
    },
  ];

  return columns;
};
