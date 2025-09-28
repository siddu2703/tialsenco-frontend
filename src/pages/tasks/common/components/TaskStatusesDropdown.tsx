/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import { useTaskStatusesQuery } from '$app/common/queries/task-statuses';
import Tippy from '@tippyjs/react/headless';
import { Dispatch, SetStateAction, useState } from 'react';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { Task } from '$app/common/interfaces/task';
import { useTranslation } from 'react-i18next';
import { CreateTaskStatusModal } from '$app/pages/settings/task-statuses/components/CreateTaskStatusModal';
import { TaskStatus } from '$app/common/interfaces/task-status';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { Plus } from '$app/components/icons/Plus';
import styled from 'styled-components';
import { RadioChecked } from '$app/components/icons/RadioChecked';
import { RadioUnchecked } from '$app/components/icons/RadioUnchecked';

const OptionElement = styled.div`
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

interface Props {
  visible: boolean;
  isFormBusy: boolean;
  setIsFormBusy: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  task: Task;
}
export function TaskStatusesDropdown(props: Props) {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const { isAdmin, isOwner } = useAdmin();

  const { visible, isFormBusy, setIsFormBusy, task, setVisible } = props;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: taskStatuses } = useTaskStatusesQuery({
    status: 'active',
  });

  const handleUpdateTask = useUpdateTask({
    isFormBusy,
    setIsFormBusy,
  });

  return (
    <>
      <Tippy
        placement="bottom"
        interactive={true}
        render={() => (
          <div
            className="border box rounded-md shadow-lg focus:outline-none p-1"
            style={{
              backgroundColor: colors.$1,
              borderColor: colors.$4,
              minWidth: '13rem',
              maxWidth: '20rem',
            }}
          >
            <div className="flex flex-col max-h-80 overflow-y-auto">
              {taskStatuses?.data.map((taskStatus, index) => (
                <OptionElement
                  key={index}
                  className="flex items-center p-2 space-x-2 rounded-sm"
                  onClick={() => {
                    setVisible(false);
                    handleUpdateTask({ ...task, status_id: taskStatus.id });
                  }}
                  theme={{
                    hoverColor: colors.$7,
                  }}
                >
                  <div>
                    {taskStatus.id === task.status_id ? (
                      <RadioChecked
                        size="1.2rem"
                        filledColor={colors.$1}
                        borderColor={colors.$3}
                      />
                    ) : (
                      <RadioUnchecked size="1.2rem" color={colors.$17} />
                    )}
                  </div>

                  <span className="truncate">{taskStatus.name}</span>
                </OptionElement>
              ))}
            </div>

            {Boolean(!taskStatuses?.data.length) && (
              <div className="font-medium text-center py-2 text-xs">
                {t('no_records_found')}
              </div>
            )}

            {(isAdmin || isOwner) && (
              <OptionElement
                className="flex items-center font-medium text-center p-2 rounded-sm"
                onClick={() => {
                  setIsModalOpen(true);
                  setVisible(false);
                }}
                theme={{
                  hoverColor: colors.$7,
                }}
              >
                <div className="flex items-center gap-2">
                  <Plus color={colors.$17} size="1.2rem" />

                  <span>{t('create_new')}</span>
                </div>
              </OptionElement>
            )}
          </div>
        )}
        visible={visible}
      >
        <div></div>
      </Tippy>

      <CreateTaskStatusModal
        visible={isModalOpen}
        setVisible={setIsModalOpen}
        onCreatedTaskStatus={(taskStatus: TaskStatus) =>
          handleUpdateTask({ ...task, status_id: taskStatus.id })
        }
      />
    </>
  );
}
