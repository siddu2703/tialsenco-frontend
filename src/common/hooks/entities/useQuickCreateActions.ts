/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCompanyGatewaysQuery } from '$app/common/queries/company-gateways';
import { useEffect, useState } from 'react';
import { CompanyGateway } from '$app/common/interfaces/company-gateway';
import { BankAccount } from '$app/common/interfaces/bank-accounts';
import { useBankAccountsQuery } from '$app/pages/settings/bank-accounts/common/queries';
import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { useTaxRatesQuery } from '$app/common/queries/tax-rates';
import { TaxRate } from '$app/common/interfaces/tax-rate';
import { useCurrentCompany } from '../useCurrentCompany';
import { useAdmin, useHasPermission } from '../permissions/useHasPermission';
import { proPlan } from '$app/common/guards/guards/pro-plan';
import { useEnabled } from '$app/common/guards/guards/enabled';
import { ModuleBitmask } from '$app/pages/settings/account-management/component';

interface EntityAction {
  key: string;
  url: string;
  section: 'income' | 'expense' | 'settings';
  externalLink?: boolean;
  visible: boolean;
}

export function useQuickCreateActions() {
  const currentCompany = useCurrentCompany();
  const hasPermission = useHasPermission();
  const enabled = useEnabled();

  const { isAdmin, isOwner } = useAdmin();

  const { data: gatewaysData } = useCompanyGatewaysQuery();
  const { data: bankAccountsData } = useBankAccountsQuery();
  const { data: taxRatesData } = useTaxRatesQuery({});

  const [gateways, setGateways] = useState<CompanyGateway[]>();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>();
  const [taxRates, setTaxRates] = useState<TaxRate[]>();

  useEffect(() => {
    if (gatewaysData) {
      setGateways(gatewaysData.data.data);
    }

    if (bankAccountsData) {
      setBankAccounts(bankAccountsData);
    }

    if (taxRatesData) {
      setTaxRates(taxRatesData.data.data);
    }
  }, [gatewaysData, bankAccountsData, taxRatesData]);

  const actions: EntityAction[] = [
    {
      key: 'client',
      url: '/clients/create',
      section: 'income',
      visible: hasPermission('create_client'),
    },
    {
      key: 'product',
      url: '/products/create',
      section: 'income',
      visible: hasPermission('create_product'),
    },
    {
      key: 'invoice',
      url: '/invoices/create',
      section: 'income',
      visible:
        hasPermission('create_invoice') && enabled(ModuleBitmask.Invoices),
    },
    {
      key: 'recurring_invoice',
      url: '/recurring_invoices/create',
      section: 'income',
      visible:
        hasPermission('create_recurring_invoice') &&
        enabled(ModuleBitmask.RecurringInvoices),
    },
    {
      key: 'quote',
      url: '/quotes/create',
      section: 'income',
      visible: hasPermission('create_quote') && enabled(ModuleBitmask.Quotes),
    },
    {
      key: 'credit',
      url: '/credits/create',
      section: 'income',
      visible: hasPermission('create_credit') && enabled(ModuleBitmask.Credits),
    },
    {
      key: 'payment',
      url: '/payments/create',
      section: 'income',
      visible: hasPermission('create_payment'),
    },
    {
      key: 'subscription',
      url: '/settings/subscriptions/create',
      section: 'income',
      visible: (proPlan() || enterprisePlan()) && (isAdmin || isOwner),
    },
    {
      key: 'expense',
      url: '/expenses/create',
      section: 'expense',
      visible:
        hasPermission('create_expense') && enabled(ModuleBitmask.Expenses),
    },
    {
      key: 'purchase_order',
      url: '/purchase_orders/create',
      section: 'expense',
      visible:
        hasPermission('create_purchase_order') &&
        enabled(ModuleBitmask.PurchaseOrders),
    },
    {
      key: 'vendor',
      url: '/vendors/create',
      section: 'expense',
      visible: hasPermission('create_vendor') && enabled(ModuleBitmask.Vendors),
    },
    {
      key: 'transaction',
      url: '/transactions/create',
      section: 'expense',
      visible:
        hasPermission('create_bank_transaction') &&
        enabled(ModuleBitmask.Transactions),
    },
    {
      key: 'add_stripe',
      url: '/settings/gateways/create',
      section: 'settings',
      visible: Boolean(!gateways?.length) && (isAdmin || isOwner),
    },
    {
      key: 'add_bank_account',
      url: '/settings/bank_accounts/create',
      section: 'settings',
      visible:
        enterprisePlan() &&
        Boolean(!bankAccounts?.length) &&
        (isAdmin || isOwner),
    },
    {
      key: 'tax_settings',
      url: '/settings/tax_rates/create',
      section: 'settings',
      visible: Boolean(!taxRates?.length) && (isAdmin || isOwner),
    },
    {
      key: 'add_company_logo',
      url: '/settings/company_details/logo',
      section: 'settings',
      visible:
        Boolean(!currentCompany?.settings.company_logo) && (isAdmin || isOwner),
    },
    {
      key: 'templates_and_reminders',
      url: '/settings/templates_and_reminders',
      section: 'settings',
      visible: (proPlan() || enterprisePlan()) && (isAdmin || isOwner),
    },
  ];

  return actions;
}
