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
import { MdSend } from 'react-icons/md';
import { useBulk } from '$app/common/queries/credits';
import { useColorScheme } from '$app/common/colors';

interface Props {
  selectedIds: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}
export const SendEmailBulkAction = (props: Props) => {
  const [t] = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { selectedIds, setSelected } = props;

  const bulk = useBulk();
  const colors = useColorScheme();

  return (
    <>
      <DropdownElement
        onClick={() => setIsModalOpen(true)}
        icon={<Icon element={MdSend} />}
      >
        {t('send_email')}
      </DropdownElement>

      <Modal
        title={t('bulk_email_credits')}
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <span
          className="text-lg"
          style={{
            backgroundColor: colors.$2,
            color: colors.$3,
            colorScheme: colors.$0,
          }}
        >
          {t('are_you_sure')}
        </span>

        <div className="flex justify-end space-x-4 mt-5">
          <Button
            behavior="button"
            onClick={() => {
              bulk(selectedIds, 'email');

              setSelected([]);

              setIsModalOpen(false);
            }}
          >
            {t('yes')}
          </Button>
        </div>
      </Modal>
    </>
  );
};
