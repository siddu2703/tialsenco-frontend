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
import { Radio } from '$app/components/forms';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import Toggle from '$app/components/forms/Toggle';
import { useTranslation } from 'react-i18next';
import { ExpenseCardProps } from './Details';
import { DynamicLink } from '$app/components/DynamicLink';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { useColorScheme } from '$app/common/colors';

interface Props extends ExpenseCardProps {
  taxInputType: 'by_rate' | 'by_amount';
  setTaxInputType: (type: 'by_rate' | 'by_amount') => unknown;
}

export function TaxSettings(props: Props) {
  const [t] = useTranslation();

  const { isAdmin, isOwner } = useAdmin();

  const { expense, handleChange, taxInputType, setTaxInputType } = props;

  const colors = useColorScheme();
  const company = useCurrentCompany();

  const handleResetTaxValues = (value: 'by_rate' | 'by_amount') => {
    if (value === 'by_amount') {
      handleChange('tax_rate1', 0);
      handleChange('tax_rate2', 0);
      handleChange('tax_rate3', 0);
    } else {
      handleChange('tax_amount1', 0);
      handleChange('tax_amount2', 0);
      handleChange('tax_amount3', 0);
    }

    handleChange('tax_name1', '');
    handleChange('tax_name2', '');
    handleChange('tax_name3', '');
  };

  const taxTypeChange = (value: string) => {
    setTaxInputType(value as 'by_rate' | 'by_amount');
    handleResetTaxValues(value as 'by_rate' | 'by_amount');
    handleChange('calculate_tax_by_amount', value === 'by_amount');
  };

  return (
    <Card
      title={t('taxes')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
      isLoading={!expense}
    >
      {company?.enabled_expense_tax_rates === 0 && (
        <Element leftSide={t('expense_tax_help')}>
          <DynamicLink
            to="/settings/tax_settings"
            renderSpan={!isAdmin && !isOwner}
          >
            {t('settings')}
          </DynamicLink>
        </Element>
      )}

      {company?.enabled_expense_tax_rates > 0 && expense && (
        <Element leftSide={t('enter_taxes')}>
          <Radio
            name="enter_taxes"
            options={[
              { id: 'by_rate', title: t('by_rate'), value: 'by_rate' },
              { id: 'by_amount', title: t('by_amount'), value: 'by_amount' },
            ]}
            defaultSelected={taxInputType}
            onValueChange={(value) => taxTypeChange(value)}
          />
        </Element>
      )}

      {company?.enabled_expense_tax_rates > 0 && expense && (
        <Element
          leftSide={t('inclusive_taxes')}
          leftSideHelp={
            <span className="flex flex-col">
              <span>{t('exclusive')}: 100 + 10% = 100 + 10</span>
              <span>{t('inclusive')}: 100 + 10% = 90.91 + 9.09</span>
            </span>
          }
        >
          <Toggle
            onChange={(value) => handleChange('uses_inclusive_taxes', value)}
            checked={expense.uses_inclusive_taxes}
            cypressRef="inclusiveTaxesToggle"
          />
        </Element>
      )}
    </Card>
  );
}
