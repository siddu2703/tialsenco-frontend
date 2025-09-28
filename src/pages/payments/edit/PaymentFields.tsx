/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '$app/components/cards';
import { useTranslation } from 'react-i18next';
import { Link } from '$app/components/forms';
import { useColorScheme } from '$app/common/colors';

export default function PaymentFields() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  return (
    <Card
      title={t('custom_fields')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <div className="px-6 pb-2">
        <span className="text-sm">{t('custom_fields')} &nbsp;</span>
        <Link to="/settings/custom_fields/payments" className="capitalize">
          {t('click_here')}.
        </Link>
      </div>
    </Card>
  );
}
