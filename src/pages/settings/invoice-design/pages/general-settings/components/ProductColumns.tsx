/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */
import { Card, Element } from '$app/components/cards';
import { useTranslation } from 'react-i18next';
import { SortableVariableList } from './SortableVariableList';
import { Divider } from '$app/components/cards/Divider';
import Toggle from '$app/components/forms/Toggle';
import { useHandleSettingsValueChange } from '$app/pages/settings/invoice-design/common/hooks';
import { useCustomField } from '$app/components/CustomField';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { useColorScheme } from '$app/common/colors';
import { Cube } from '$app/components/icons/Cube';

export default function ProductColumns() {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const company = useCompanyChanges();

  const customField = useCustomField();
  const handleValueChange = useHandleSettingsValueChange();

  let defaultVariables = [
    { value: '$product.item', label: t('item') },
    { value: '$product.description', label: t('description') },
    { value: '$product.quantity', label: t('quantity') },
    { value: '$product.unit_cost', label: t('unit_cost') },
    { value: '$product.tax', label: t('tax') },
    { value: '$product.discount', label: t('discount') },
    { value: '$product.line_total', label: t('line_total') },
    {
      value: '$product.product1',
      label: company?.custom_fields?.product1
        ? customField('product1').label()
        : t('custom1'),
    },
    {
      value: '$product.product2',
      label: company?.custom_fields?.product2
        ? customField('product2').label()
        : t('custom2'),
    },
    {
      value: '$product.product3',
      label: company?.custom_fields?.product3
        ? customField('product3').label()
        : t('custom3'),
    },
    {
      value: '$product.product4',
      label: company?.custom_fields?.product4
        ? customField('product4').label()
        : t('custom4'),
    },
    { value: '$product.gross_line_total', label: t('gross_line_total') },
    { value: '$product.tax_amount', label: t('tax_amount') },
  ];

  if (!company?.enabled_item_tax_rates) {
    defaultVariables = defaultVariables.filter(
      (variable) =>
        variable.value !== '$product.tax_amount' &&
        variable.value !== '$product.tax'
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center space-x-2">
          <div>
            <Cube color="#2176FF" size="1.3rem" />
          </div>

          <span>
            {company?.settings.sync_invoice_quote_columns
              ? t('product_columns')
              : t('invoice_product_columns')}
          </span>
        </div>
      }
      padding="small"
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <SortableVariableList
        for="product_columns"
        defaultVariables={defaultVariables}
      />

      <div className="px-4 sm:px-6 py-4">
        <Divider
          className="border-dashed"
          borderColor={colors.$20}
          withoutPadding
        />
      </div>

      <Element leftSide={t('share_invoice_quote_columns')}>
        <Toggle
          checked={Boolean(company?.settings.sync_invoice_quote_columns)}
          onValueChange={(value) =>
            handleValueChange('sync_invoice_quote_columns', value)
          }
        />
      </Element>
    </Card>
  );
}
