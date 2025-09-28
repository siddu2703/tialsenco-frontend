/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { DataTable } from '$app/components/DataTable';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';
import {
  defaultColumns,
  useActions,
  useAllQuoteColumns,
  useQuoteColumns,
  useQuoteFilters,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { ImportButton } from '$app/components/import/ImportButton';
import { Guard } from '$app/common/guards/Guard';
import { or } from '$app/common/guards/guards/or';
import { permission } from '$app/common/guards/guards/permission';
import { useCustomBulkActions } from '../common/hooks/useCustomBulkActions';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useAtom } from 'jotai';
import {
  QuoteSlider,
  quoteSliderAtom,
  quoteSliderVisibilityAtom,
} from '../common/components/QuoteSlider';
import { useEffect, useState } from 'react';
import { useQuoteQuery } from '../common/queries';
import { useDisableNavigation } from '$app/common/hooks/useDisableNavigation';
import {
  ChangeTemplateModal,
  useChangeTemplate,
} from '$app/pages/settings/invoice-design/pages/custom-designs/components/ChangeTemplate';
import { Quote } from '$app/common/interfaces/quote';
import { useFooterColumns } from '../common/hooks/useFooterColumns';
import { DataTableFooterColumnsPicker } from '$app/components/DataTableFooterColumnsPicker';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { useDateRangeColumns } from '../common/hooks/useDateRangeColumns';
import { InputLabel } from '$app/components/forms';

export default function Quotes() {
  const { documentTitle } = useTitle('quotes');

  const [t] = useTranslation();
  const hasPermission = useHasPermission();
  const disableNavigation = useDisableNavigation();

  const [sliderQuoteId, setSliderQuoteId] = useState<string>('');
  const [quoteSlider, setQuoteSlider] = useAtom(quoteSliderAtom);
  const [quoteSliderVisibility, setQuoteSliderVisibility] = useAtom(
    quoteSliderVisibilityAtom
  );

  const actions = useActions();
  const filters = useQuoteFilters();
  const columns = useQuoteColumns();
  const reactSettings = useReactSettings();
  const quoteColumns = useAllQuoteColumns();
  const dateRangeColumns = useDateRangeColumns();
  const customBulkActions = useCustomBulkActions();
  const { footerColumns, allFooterColumns } = useFooterColumns();

  const { data: quoteResponse } = useQuoteQuery({ id: sliderQuoteId });

  const pages: Page[] = [{ name: t('quotes'), href: route('/quotes') }];

  useEffect(() => {
    if (quoteResponse && quoteSliderVisibility) {
      setQuoteSlider(quoteResponse);
    }
  }, [quoteResponse, quoteSliderVisibility]);

  useEffect(() => {
    return () => setQuoteSliderVisibility(false);
  }, []);

  const {
    changeTemplateVisible,
    setChangeTemplateVisible,
    changeTemplateResources,
  } = useChangeTemplate();

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <DataTable
        resource="quote"
        columns={columns}
        footerColumns={footerColumns}
        endpoint="/api/v1/quotes?include=client&without_deleted_clients=true&sort=id|desc"
        linkToEdit="/quotes/:id/edit"
        linkToCreate="/quotes/create"
        bulkRoute="/api/v1/quotes/bulk"
        customActions={actions}
        customBulkActions={customBulkActions}
        customFilters={filters}
        customFilterPlaceholder="status"
        withResourcefulActions
        rightSide={
          <div className="flex items-center space-x-2">
            {Boolean(reactSettings.show_table_footer) && (
              <DataTableFooterColumnsPicker
                table="quote"
                columns={allFooterColumns}
              />
            )}

            <DataTableColumnsPicker
              columns={quoteColumns as unknown as string[]}
              defaultColumns={defaultColumns}
              table="quote"
            />

            <Guard
              type="component"
              guards={[
                or(permission('create_quote'), permission('edit_quote')),
              ]}
              component={<ImportButton route="/quotes/import" />}
            />
          </div>
        }
        onTableRowClick={(quote) => {
          setSliderQuoteId(quote.id);
          setQuoteSliderVisibility(true);
        }}
        dateRangeColumns={dateRangeColumns}
        linkToCreateGuards={[permission('create_quote')]}
        hideEditableOptions={!hasPermission('edit_quote')}
        enableSavingFilterPreference
      />

      {!disableNavigation('quote', quoteSlider) && <QuoteSlider />}

      <ChangeTemplateModal<Quote>
        entity="quote"
        entities={changeTemplateResources as Quote[]}
        visible={changeTemplateVisible}
        setVisible={setChangeTemplateVisible}
        labelFn={(quote) => (
          <div className="flex flex-col space-y-1">
            <InputLabel>{t('number')}</InputLabel>

            <span>{quote.number}</span>
          </div>
        )}
        bulkLabelFn={(quote) => (
          <div className="flex space-x-2">
            <InputLabel>{t('number')}:</InputLabel>

            <span>{quote.number}</span>
          </div>
        )}
        bulkUrl="/api/v1/quotes/bulk"
      />
    </Default>
  );
}
