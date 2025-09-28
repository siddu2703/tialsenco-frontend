/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Modal } from '$app/components/Modal';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Button } from '$app/components/forms';
import { Icon } from '$app/components/icons/Icon';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBulkAction } from '../hooks/useBulkAction';
import { AiOutlineFileText } from 'react-icons/ai';

interface Props {
  selectedIds: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}
export const ConvertToInvoiceBulkAction = (props: Props) => {
  const [t] = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { selectedIds, setSelected } = props;

  const bulk = useBulkAction();

  return (
    <>
      <DropdownElement
        onClick={() => setIsModalOpen(true)}
        icon={<Icon element={AiOutlineFileText} />}
      >
        {t('convert_to_invoice')}
      </DropdownElement>

      <Modal
        title={t('convert_to_invoice')}
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <span className="text-lg text-gray-900">{t('are_you_sure')}</span>

        <div className="flex justify-end space-x-4 mt-5">
          <Button
            behavior="button"
            onClick={() => {
              bulk(selectedIds, 'convert_to_invoice');
              setSelected([]);
              setIsModalOpen(false);
            }}
          >
            <span className="text-base mx-3">{t('yes')}</span>
          </Button>
        </div>
      </Modal>
    </>
  );
};
