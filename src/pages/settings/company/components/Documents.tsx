/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { ClickableElement } from '../../../../components/cards';

export function Documents() {
  const [t] = useTranslation();

  return (
    <>
      <ClickableElement to="/settings/company_details/documents">
        {t('default_documents')}
      </ClickableElement>
    </>
  );
}
