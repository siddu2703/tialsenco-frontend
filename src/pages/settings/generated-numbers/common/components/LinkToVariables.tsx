/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import { useTranslation } from 'react-i18next';

export function LinkToVariables() {
  const [t] = useTranslation();

  return (
    <Link
      className="pl-4 sm:pl-6"
      to="https://tilsenco.github.io/en/custom-fields/#custom-fields"
      external
    >
      {t('click_to_variables')}
    </Link>
  );
}
