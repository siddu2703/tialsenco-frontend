/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Dispatch, SetStateAction, useState } from 'react';
import { MergeClientModal } from './MergeClientModal';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { useTranslation } from 'react-i18next';
import { Client } from '$app/common/interfaces/client';
import { Icon } from '$app/components/icons/Icon';
import { BiGitMerge } from 'react-icons/bi';

interface Props {
  client: Client;
  setIsPurgeOrMergeActionCalled?: Dispatch<SetStateAction<boolean>>;
}
export function MergeClientAction(props: Props) {
  const [t] = useTranslation();

  const { client, setIsPurgeOrMergeActionCalled } = props;

  const [isMergeModalOpen, setIsMergeModalOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownElement
        onClick={() => setIsMergeModalOpen(true)}
        icon={<Icon element={BiGitMerge} />}
      >
        {t('merge')}
      </DropdownElement>

      <MergeClientModal
        visible={isMergeModalOpen}
        setVisible={setIsMergeModalOpen}
        mergeFromClientId={client.id}
        setIsPurgeOrMergeActionCalled={setIsPurgeOrMergeActionCalled}
      />
    </>
  );
}
