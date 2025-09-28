/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { InvoiceItem } from '$app/common/interfaces/invoice-item';
import { TaxRate } from '$app/common/interfaces/tax-rate';
import { useSetAtom } from 'jotai';
import {
  ProductTableResource,
  isDeleteActionTriggeredAtom,
} from '../components/ProductsTable';

interface Props {
  resource: ProductTableResource;
  type: 'product' | 'task';
  onChange: (index: number, lineItem: InvoiceItem) => unknown;
}

export function useHandleTaxRateChange(props: Props) {
  const resource = props.resource;

  const setIsDeleteActionTriggered = useSetAtom(isDeleteActionTriggeredAtom);

  return (property: keyof InvoiceItem, index: number, taxRate?: TaxRate) => {
    setIsDeleteActionTriggered(false);

    const lineItem = { ...resource.line_items[index] };

    lineItem[property] = (taxRate?.rate as keyof typeof taxRate) ?? 0;

    lineItem[property.replace('rate', 'name') as keyof InvoiceItem] =
      (taxRate?.name as keyof typeof taxRate) || '';

    return props.onChange(index, lineItem);
  };
}
