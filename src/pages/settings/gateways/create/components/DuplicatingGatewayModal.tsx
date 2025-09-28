/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Button } from '$app/components/forms';
import { Icon } from '$app/components/icons/Icon';
import { Modal } from '$app/components/Modal';

import { useTranslation } from 'react-i18next';
import { MdInfo } from 'react-icons/md';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DuplicatingGatewayModal(props: Props) {
  const { t } = useTranslation();

  const { visible, onConfirm, onCancel } = props;

  return (
    <Modal title={t('existing_gateway')} visible={visible} onClose={onCancel}>
      <div className="flex flex-col space-y-5">
        <div className="flex items-center space-x-4">
          <div>
            <Icon element={MdInfo} size={24} />
          </div>

          <span className="font-medium text-center">
            {t('confirm_duplicate_gateway')}
          </span>
        </div>

        <div className="flex justify-between">
          <Button behavior="button" type="secondary" onClick={onCancel}>
            {t('no')}
          </Button>

          <Button onClick={onConfirm}>{t('yes')}</Button>
        </div>
      </div>
    </Modal>
  );
}
