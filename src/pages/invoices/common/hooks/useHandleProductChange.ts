/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useClientResolver } from '$app/common/hooks/clients/useClientResolver';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useResolveCurrency } from '$app/common/hooks/useResolveCurrency';
import { InvoiceItem } from '$app/common/interfaces/invoice-item';
import { Product } from '$app/common/interfaces/product';
import {
  ProductTableResource,
  RelationType,
} from '../components/ProductsTable';

interface Props {
  relationType: RelationType;
  resource: ProductTableResource;
  type: 'product' | 'task';
  onChange: (index: number, lineItem: InvoiceItem) => unknown;
}

export function useHandleProductChange(props: Props) {
  const company = useCurrentCompany();

  const resolveCurrency = useResolveCurrency();
  const resolveClient = useClientResolver();

  const resource = props.resource;

  return async (
    index: number,
    product_key: string,
    product: Product | null
  ) => {
    const lineItem = { ...resource.line_items[index] };

    lineItem.product_key = product?.product_key || product_key;

    if (!product) {
      // When we deal with inline product key
      // keep everything but the name.

      return props.onChange(index, lineItem);
    }

    const currentPrice =
      product?.cost > 0 && props.relationType === 'vendor_id'
        ? product?.cost
        : product?.price || 0;

    if (company.fill_products) {
      if (!company?.enable_product_quantity) {
        lineItem.quantity = 1;
      } else {
        lineItem.quantity = company?.default_quantity
          ? 1
          : product?.quantity ?? 1;
      }

      if (resource.client_id) {
        await resolveClient.find(resource.client_id).then((client) => {
          const clientCurrencyId = client.settings.currency_id;

          if (
            company.convert_products &&
            clientCurrencyId !== company.settings.currency_id
          ) {
            const clientCurrency = resolveCurrency(clientCurrencyId);
            const companyCurrency = resolveCurrency(
              company.settings.currency_id
            );

            if (clientCurrency && companyCurrency) {
              lineItem.cost =
                currentPrice *
                (clientCurrency.exchange_rate / companyCurrency.exchange_rate);
            }
          } else {
            lineItem.cost = currentPrice;
          }
        });
      } else {
        lineItem.cost = currentPrice;
      }
    }

    if (!product) {
      lineItem.notes = '';
    }

    if (props.type == 'product' && product?.notes && company.fill_products) {
      lineItem.notes = product?.notes;
    }

    if (props.type == 'task' && product?.notes && !lineItem.notes) {
      lineItem.notes = product.notes;
    }

    lineItem.tax_name1 = product?.tax_name1 || '';
    lineItem.tax_name2 = product?.tax_name2 || '';
    lineItem.tax_name3 = product?.tax_name3 || '';

    lineItem.tax_rate1 = product?.tax_rate1 || 0;
    lineItem.tax_rate2 = product?.tax_rate2 || 0;
    lineItem.tax_rate3 = product?.tax_rate3 || 0;

    lineItem.custom_value1 = product?.custom_value1 || '';
    lineItem.custom_value2 = product?.custom_value2 || '';
    lineItem.custom_value3 = product?.custom_value3 || '';
    lineItem.custom_value4 = product?.custom_value4 || '';
    lineItem.tax_id = product?.tax_id || '1';

    lineItem.product_cost = product?.cost;

    return props.onChange(index, lineItem);
  };
}
