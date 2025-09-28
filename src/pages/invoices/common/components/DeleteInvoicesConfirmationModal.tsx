/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { emitter } from '$app';
import { useBulk } from '$app/common/queries/invoices';
import {
  ConfirmActionModal,
  confirmActionModalAtom,
} from '$app/pages/recurring-invoices/common/components/ConfirmActionModal';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

interface Props {
  selectedInvoiceIds: string[];
  setSelectedInvoiceIds: (ids: string[]) => void;
}

export function DeleteInvoicesConfirmationModal({
  selectedInvoiceIds,
  setSelectedInvoiceIds,
}: Props) {
  const [t] = useTranslation();

  const setIsConfirmActionModalOpen = useSetAtom(confirmActionModalAtom);

  const deselectAll = () => {
    setSelectedInvoiceIds([]);
    emitter.emit('bulk.completed');
  };

  const bulk = useBulk({
    onSuccess: deselectAll,
  });

  return (
    <ConfirmActionModal
      title={t('confirmation')}
      message={t('are_you_sure')}
      disabledButton={selectedInvoiceIds.length === 0}
      disableButtonWithoutLoadingIcon
      onClose={deselectAll}
      onClick={() => {
        bulk(selectedInvoiceIds, 'delete');
        setIsConfirmActionModalOpen(false);
        deselectAll();
      }}
    />
  );
}
