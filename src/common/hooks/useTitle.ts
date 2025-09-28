/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentCompany } from './useCurrentCompany';

export function useTitle(title: string, translate = true) {
  const [t] = useTranslation();
  const company = useCurrentCompany();

  const [documentTitle, setDocumentTitle] = useState(
    translate ? t(title) || '' : title
  );

  const getAppTitle = () => {
    let appTitle = '';

    if (import.meta.env.VITE_APP_TITLE) {
      appTitle = import.meta.env.VITE_APP_TITLE;
    } else {
      if (company?.settings.name) {
        appTitle = company.settings.name;
      } else {
        appTitle = t('untitled');
      }
    }

    return `${appTitle}: ${documentTitle}`;
  };

  useEffect(() => {
    document.title = getAppTitle();
  }, [documentTitle]);

  return {
    documentTitle,
    setDocumentTitle,
  };
}
