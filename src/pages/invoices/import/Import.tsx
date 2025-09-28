/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { $help, HelpWidget } from '$app/components/HelpWidget';
import { UploadImport } from '$app/components/import/UploadImport';
import { Default } from '$app/components/layouts/Default';
import { HelpCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';

export default function Import() {
  const { t } = useTranslation();
  const { documentTitle } = useTitle('import');

  const pages: Page[] = [
    { name: t('invoices'), href: '/invoices' },
    { name: t('import'), href: '/invoices/import' },
  ];

  const accentColor = useAccentColor();

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <div className="grid grid-cols-12">
        <div className="col-span-12 xl:col-span-8">
          <UploadImport
            entity="invoice"
            onSuccess={false}
            type="csv"
            postWidgetSlot={
              <button
                type="button"
                style={{ color: accentColor }}
                onClick={() => $help('import-and-export')}
                className="inline-flex items-center space-x-1 mt-4"
              >
                <HelpCircle size={18} />
                <span>{t('how_to_import_data')}</span>
              </button>
            }
            exampleUrl="https://tilsenco.github.io/assets/example-imports/invoices.csv"
          />

          <HelpWidget
            id="import-and-export"
            url="https://raw.githubusercontent.com/invoiceninja/tilsenco.github.io/refs/heads/v5-rework/source/en/import-and-export.md"
          />
        </div>
      </div>
    </Default>
  );
}
