/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import { useTitle } from '$app/common/hooks/useTitle';
import { useTaskStatusesQuery } from '$app/common/queries/task-statuses';
import { useTasksQuery } from '$app/common/queries/tasks';
import { Default } from '$app/components/layouts/Default';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTable } from 'react-icons/bs';
import { calculateHours } from '../common/helpers/calculate-time';
import collect from 'collect.js';
import { toast } from '$app/common/helpers/toast/toast';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggableProvided,
  DropResult,
  Droppable,
  DroppableProvided,
} from '@hello-pangea/dnd';
import { cloneDeep } from 'lodash';
import { arrayMoveImmutable } from 'array-move';
import { Task } from '$app/common/interfaces/task';
import { useAtom } from 'jotai';
import { ViewSlider } from './components/ViewSlider';
import { isTaskRunning } from '../common/helpers/calculate-entity-state';
import {
  currentTaskAtom,
  currentTaskIdAtom,
  isKanbanViewSliderVisibleAtom,
} from './common/atoms';
import { useFormatTimeLog, useHandleCurrentTask } from './common/hooks';
import { useStart } from '../common/hooks/useStart';
import { useStop } from '../common/hooks/useStop';
import { Slider } from '$app/components/cards/Slider';
import { EditSlider } from './components/EditSlider';
import { useNavigate } from 'react-router-dom';
import { Card } from '$app/components/cards';
import { ProjectSelector } from '$app/components/projects/ProjectSelector';
import { Inline } from '$app/components/Inline';
import { CreateTaskStatusModal } from '$app/pages/settings/task-statuses/components/CreateTaskStatusModal';
import {
  CreateTaskModal,
  TaskDetails,
} from '../common/components/CreateTaskModal';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useColorScheme } from '$app/common/colors';
import {
  useAdmin,
  useHasPermission,
} from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { TaskClock } from './components/TaskClock';
import styled from 'styled-components';
import { Pencil } from '$app/components/icons/Pencil';
import { MediaPlay } from '$app/components/icons/MediaPlay';
import { MediaPause } from '$app/components/icons/MediaPause';
import { Plus } from '$app/components/icons/Plus';

const Container = styled.div`
  min-width: ${(props) => props.theme.minWidth}px;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
  color-scheme: ${(props) => props.theme.colorScheme};
  border-color: ${(props) => props.theme.borderColor};
`;

interface CardItem {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  task: Task;
}

interface Column {
  id: string;
  title: string;
  cards: CardItem[];
}

interface Board {
  columns: Column[];
}

type SliderType = 'view' | 'edit';

const Box = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }
`;

export default function Kanban() {
  const { documentTitle } = useTitle('kanban');
  const [t] = useTranslation();

  const colors = useColorScheme();
  const { isAdmin, isOwner } = useAdmin();

  const stopTask = useStop();
  const startTask = useStart();
  const navigate = useNavigate();
  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const formatTimeLog = useFormatTimeLog();

  const pages = [
    { name: t('tasks'), href: '/tasks' },
    { name: t('kanban'), href: '/tasks/kanban' },
  ];

  const [apiEndpoint, setApiEndpoint] = useState(
    '/api/v1/tasks?per_page=1000&status=active&without_deleted_clients=true'
  );
  const [board, setBoard] = useState<Board>();
  const [projectId, setProjectId] = useState<string>();
  const [taskDetails, setTaskDetails] = useState<TaskDetails>();
  const [sliderType, setSliderType] = useState<SliderType>('view');
  const [isTaskModalOpened, setIsTaskModalOpened] = useState<boolean>(false);
  const [isTaskStatusModalOpened, setIsTaskStatusModalOpened] =
    useState<boolean>(false);

  const { data: taskStatuses } = useTaskStatusesQuery({ status: 'active' });
  const { data: tasks } = useTasksQuery({
    endpoint: apiEndpoint,
  });

  const [currentTask] = useAtom(currentTaskAtom);
  const [currentTaskId, setCurrentTaskId] = useAtom(currentTaskIdAtom);
  const [isKanbanViewSliderVisible, setIsKanbanViewSliderVisible] = useAtom(
    isKanbanViewSliderVisibleAtom
  );

  useHandleCurrentTask(currentTaskId);

  useEffect(() => {
    if (taskStatuses && tasks) {
      const columns: Column[] = [];

      const reorderedStatuses = [...taskStatuses.data].sort(
        (a, b) => a.status_order - b.status_order
      );

      reorderedStatuses.map((taskStatus) =>
        columns.push({ id: taskStatus.id, title: taskStatus.name, cards: [] })
      );

      tasks.data
        .filter(({ invoice_id }) => !invoice_id)
        .map((task) => {
          const index = columns.findIndex(
            (column) => column.id === task.status_id
          );

          if (index >= 0) {
            columns[index].cards.push({
              id: task.id,
              title: task.description,
              description: calculateHours(task.time_log).toString(),
              sortOrder: task.status_order,
              task,
            });
          }
        });

      columns.map(
        (c) => (c.cards = c.cards.sort((a, b) => a.sortOrder - b.sortOrder))
      );

      setBoard((current) => ({ ...current, columns }));
    }
  }, [taskStatuses, tasks]);

  const updateTasks = (board: Board) => {
    const taskIds: Record<string, string[]> = {};
    const statusIds = collect(board.columns).pluck('id').toArray() as string[];

    statusIds.forEach((id) => (taskIds[id] = []));

    board.columns.forEach((column) => {
      column.cards.map((card) => taskIds[column.id].push(card.id));
    });

    const payload = {
      status_ids: statusIds,
      task_ids: taskIds,
    };

    toast.processing();

    request('POST', endpoint('/api/v1/tasks/sort'), payload)
      .then(() => toast.success())
      .finally(() => {
        $refetch(['tasks']);
        $refetch(['task_statuses']);
      });
  };

  const onCardsDragEnd = (result: DropResult) => {
    const local = cloneDeep(board) as Board;

    const source = local.columns.find(
      (c) => c.title === result.source.droppableId
    );

    const sourceIndex = local.columns.findIndex(
      (c) => c.title === result.source.droppableId
    ) as number;

    const target = local.columns.find(
      (c) => c.title === result.destination?.droppableId
    );

    const targetIndex = local.columns.findIndex(
      (c) => c.title === result.destination?.droppableId
    );

    if (source && sourceIndex > -1 && target && targetIndex > -1) {
      const task = source.cards.find((task) => task.id === result.draggableId);

      if (task) {
        local.columns[sourceIndex].cards = source.cards.filter(
          (card) => card.id !== result.draggableId
        );

        local.columns[targetIndex].cards.push(task);

        local.columns[targetIndex].cards = arrayMoveImmutable(
          local.columns[targetIndex].cards,
          local.columns[targetIndex].cards.length - 1,
          result.destination?.index as number
        );

        setBoard(local);
        updateTasks(local);
      }
    }
  };

  const onColumnsDragEnd = (result: DropResult) => {
    const local = cloneDeep(board) as Board;

    const sortedColumns = arrayMoveImmutable(
      local.columns as Column[],
      result.source.index,
      result.destination?.index as number
    );

    if (result.source.index === (result.destination?.index as number)) {
      return;
    }

    local.columns = sortedColumns;

    setBoard(local);
    updateTasks(local);
  };

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (result.type === 'COLUMN') {
      onColumnsDragEnd(result);
      return;
    }

    onCardsDragEnd(result);
  };

  const handleCurrentTask = (id: string, slider: SliderType) => {
    if (slider === 'edit') {
      setSliderType('edit');
    }

    if (slider === 'view') {
      setSliderType('view');
    }

    if (currentTaskId === id) {
      return setIsKanbanViewSliderVisible(true);
    }

    setCurrentTaskId(id);
  };

  const handleKanbanClose = () => {
    setIsKanbanViewSliderVisible(false);
    setCurrentTaskId(undefined);
  };

  useEffect(() => {
    projectId
      ? setApiEndpoint(
          route(
            '/api/v1/tasks?project_tasks=:projectId&per_page=1000&status=active&without_deleted_clients=true',
            {
              projectId,
            }
          )
        )
      : setApiEndpoint(
          '/api/v1/tasks?per_page=1000&status=active&without_deleted_clients=true'
        );
  }, [projectId]);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      navigationTopRight={
        <Link to="/tasks">
          <Inline>
            <BsTable size={20} />
            <span>{t('tasks')}</span>
          </Inline>
        </Link>
      }
    >
      <Slider
        title={
          currentTask
            ? `${t('task')} ${currentTask.number}`
            : (t('task') as string)
        }
        visible={isKanbanViewSliderVisible}
        onClose={handleKanbanClose}
        withoutHeaderBorder
        withoutDivider={
          currentTask &&
          sliderType === 'edit' &&
          !formatTimeLog(currentTask.time_log).length
        }
        actionChildren={
          <div
            className="flex w-full divide-x-2"
            style={{
              color: colors.$3,
              colorScheme: colors.$0,
              backgroundColor: colors.$1,
              borderColor: colors.$4,
            }}
          >
            {sliderType === 'view' &&
              (hasPermission('edit_task') || entityAssigned(currentTask)) && (
                <Box
                  className="flex justify-center items-center text-sm p-4 space-x-2 w-full cursor-pointer focus:outline-none focus:ring-0"
                  onClick={() =>
                    navigate(route('/tasks/:id/edit', { id: currentTask?.id }))
                  }
                  style={{
                    borderColor: colors.$20,
                  }}
                  theme={{
                    color: colors.$3,
                    backgroundColor: colors.$1,
                    hoverBackgroundColor: colors.$4,
                  }}
                >
                  <div>
                    <Pencil color={colors.$3} size="1.2rem" />
                  </div>

                  <span>{t('edit_task')}</span>
                </Box>
              )}

            {/* <button className="flex justify-center items-center text-sm p-4 space-x-2 w-full hover:bg-gray-50">
              <Plus size={18} />
              <span>{t('invoice_task')}</span>
            </button> */}

            {currentTask &&
              !isTaskRunning(currentTask) &&
              (hasPermission('edit_task') || entityAssigned(currentTask)) && (
                <Box
                  className="flex justify-center items-center text-sm p-4 space-x-2 w-full cursor-pointer focus:outline-none focus:ring-0"
                  onClick={() => startTask(currentTask)}
                  style={{
                    borderColor: colors.$20,
                  }}
                  theme={{
                    color: colors.$3,
                    backgroundColor: colors.$1,
                    hoverBackgroundColor: colors.$4,
                  }}
                >
                  <div>
                    <MediaPlay
                      color={colors.$3}
                      filledColor="transparent"
                      size="1.2rem"
                    />
                  </div>

                  <span>{t('start')}</span>
                </Box>
              )}

            {currentTask &&
              isTaskRunning(currentTask) &&
              (hasPermission('edit_task') || entityAssigned(currentTask)) && (
                <Box
                  className="flex justify-center items-center text-sm p-4 space-x-2 w-full cursor-pointer focus:outline-none focus:ring-0"
                  onClick={() => stopTask(currentTask)}
                  style={{
                    borderColor: colors.$20,
                  }}
                  theme={{
                    color: colors.$3,
                    backgroundColor: colors.$1,
                    hoverBackgroundColor: colors.$4,
                  }}
                >
                  <div>
                    <MediaPause
                      color={colors.$3}
                      filledColor="transparent"
                      size="1.2rem"
                    />
                  </div>

                  <span>{t('stop')}</span>
                </Box>
              )}
          </div>
        }
        size="regular"
        withoutActionContainer
      >
        {sliderType === 'view' && <ViewSlider />}
        {sliderType === 'edit' && <EditSlider />}
      </Slider>

      <Card
        className="w-full xl:w-2/5 rounded-sm shadow-sm"
        style={{
          borderColor: colors.$21,
        }}
      >
        <div className="flex flex-col items-start md:flex-row md:items-center px-4 md:px-6 py-4 md:space-x-10 md:justify-between">
          <span className="text-sm font-medium mb-1 md:mb-0">
            {t('project')}
          </span>

          <ProjectSelector
            value={projectId}
            onChange={(project) => setProjectId(project.id)}
            onClearButtonClick={() => setProjectId(undefined)}
            clearButton
          />
        </div>
      </Card>

      {board && (
        <div
          className="flex border space-x-4 overflow-x-auto mt-4 p-6 shadow-sm rounded-sm"
          style={{
            color: colors.$3,
            backgroundColor: colors.$1,
            borderColor: colors.$21,
            paddingRight: isKanbanViewSliderVisible ? 512 : 0,
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="columns"
              type="COLUMN"
              direction="horizontal"
            >
              {(columnProvided: DroppableProvided) => (
                <div
                  className="flex space-x-4"
                  ref={columnProvided.innerRef}
                  {...columnProvided.droppableProps}
                >
                  {board.columns.map((column, index) => (
                    <Draggable
                      key={column.id}
                      draggableId={column.title}
                      index={index}
                    >
                      {(columnDraggableProvided: DraggableProvided) => (
                        <Container
                          className="rounded border shadow select-none h-max"
                          ref={columnDraggableProvided.innerRef}
                          {...columnDraggableProvided.draggableProps}
                          theme={{
                            minWidth: 360,
                            color: colors.$3,
                            backgroundColor: colors.$1,
                            borderColor: colors.$21,
                          }}
                        >
                          <div
                            {...columnDraggableProvided.dragHandleProps}
                            className="flex items-center justify-between border-b rounded-tl rounded-tr px-4 py-5"
                            style={{
                              color: colors.$3,
                              backgroundColor: colors.$1,
                              borderColor: colors.$20,
                            }}
                          >
                            <h3 className="leading-6 font-medium">
                              {column.title.slice(0, 25)}
                              {column.title.length > 25 && '...'}
                            </h3>

                            {hasPermission('create_task') && (
                              <Box
                                className="cursor-pointer focus:outline-none focus:ring-0 p-1 border rounded-sm"
                                onClick={() => {
                                  setTaskDetails({
                                    taskStatusId: column.id,
                                    projectId,
                                  });
                                  setIsTaskModalOpened(true);
                                }}
                                style={{
                                  borderColor: colors.$21,
                                }}
                                theme={{
                                  backgroundColor: colors.$1,
                                  hoverBackgroundColor: colors.$4,
                                }}
                              >
                                <Plus size="1.1rem" color={colors.$3} />
                              </Box>
                            )}
                          </div>

                          <Droppable
                            droppableId={column.title}
                            type="CARD"
                            renderClone={(provided, _, rubric) => {
                              const card = column.cards.find(
                                ({ id }) => id === rubric.draggableId
                              );

                              if (!card) {
                                return <></>;
                              }

                              return (
                                <div
                                  className="w-full text-leftblock rounded text-sm cursor-pointer"
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <div
                                    className="px-4 sm:px-6 py-4 border"
                                    style={{
                                      color: colors.$3,
                                      backgroundColor: colors.$4,
                                      borderColor: colors.$21,
                                    }}
                                  >
                                    <p>
                                      {card.title.slice(0, 35)}
                                      {card.title.length > 35 && '...'}
                                    </p>

                                    <div className="font-mono font-medium text-xs">
                                      {isTaskRunning(card.task) ? (
                                        <TaskClock
                                          task={card.task}
                                          extraSmallText
                                        />
                                      ) : (
                                        card.description
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    className="flex border-b border-l border-r justify-center items-center divide-x-2"
                                    style={{
                                      color: colors.$3,
                                      backgroundColor: colors.$1,
                                      borderColor: colors.$21,
                                    }}
                                  >
                                    {(hasPermission('view_task') ||
                                      hasPermission('edit_task') ||
                                      entityAssigned(currentTask)) && (
                                      <button
                                        style={{
                                          color: colors.$3,
                                          backgroundColor: colors.$1,
                                        }}
                                        className="w-full py-2 rounded-bl"
                                        onClick={() =>
                                          handleCurrentTask(card.id, 'view')
                                        }
                                      >
                                        {t('view')}
                                      </button>
                                    )}

                                    {(hasPermission('edit_task') ||
                                      entityAssigned(currentTask)) && (
                                      <button
                                        style={{
                                          color: colors.$3,
                                          backgroundColor: colors.$1,
                                        }}
                                        className="w-full text-center py-2"
                                        onClick={() =>
                                          handleCurrentTask(card.id, 'edit')
                                        }
                                      >
                                        {t('edit')}
                                      </button>
                                    )}

                                    {isTaskRunning(card.task) &&
                                      (hasPermission('edit_task') ||
                                        entityAssigned(currentTask)) && (
                                        <button
                                          className="w-full py-2 rounded-br"
                                          onClick={() => stopTask(card.task)}
                                          style={{
                                            color: colors.$3,
                                            backgroundColor: colors.$1,
                                          }}
                                        >
                                          {t('stop')}
                                        </button>
                                      )}

                                    {!isTaskRunning(card.task) &&
                                      (hasPermission('edit_task') ||
                                        entityAssigned(currentTask)) && (
                                        <button
                                          style={{
                                            color: colors.$3,
                                            backgroundColor: colors.$1,
                                          }}
                                          className="w-full py-2 rounded-br"
                                          onClick={() => startTask(card.task)}
                                        >
                                          {t('start')}
                                        </button>
                                      )}
                                  </div>
                                </div>
                              );
                            }}
                          >
                            {(dropProvided) => (
                              <div {...dropProvided.droppableProps}>
                                <div
                                  ref={dropProvided.innerRef}
                                  className="p-4 space-y-4 rounded-bl rounded-br"
                                  style={{
                                    color: colors.$3,
                                    colorScheme: colors.$0,
                                    backgroundColor: colors.$1,
                                    borderColor: colors.$3,
                                  }}
                                >
                                  {column.cards.map((card, index: number) => (
                                    <Draggable
                                      key={card.id}
                                      draggableId={card.id}
                                      index={index}
                                    >
                                      {(dragProvided) => (
                                        <Container
                                          className="w-full text-leftblock text-sm group"
                                          ref={dragProvided.innerRef}
                                          {...dragProvided.draggableProps}
                                          {...dragProvided.dragHandleProps}
                                          theme={{
                                            backgroundColor: colors.$7,
                                            color: colors.$3,
                                          }}
                                        >
                                          <div className="flex flex-col justify-center px-4 sm:px-6 py-4 border rounded-t-sm h-14">
                                            <p>
                                              {card.title.slice(0, 35)}
                                              {card.title.length > 35 && '...'}
                                            </p>

                                            <div className="font-mono font-medium text-xs">
                                              {isTaskRunning(card.task) ? (
                                                <TaskClock
                                                  task={card.task}
                                                  extraSmallText
                                                />
                                              ) : (
                                                card.description
                                              )}
                                            </div>
                                          </div>

                                          <div
                                            className="hidden group-hover:flex border-b border-l border-r justify-center rounded-br rounded-bl items-center divide-x-2"
                                            style={{
                                              color: colors.$3,
                                              backgroundColor: colors.$1,
                                              borderColor: colors.$21,
                                            }}
                                          >
                                            {(hasPermission('view_task') ||
                                              hasPermission('edit_task') ||
                                              entityAssigned(currentTask)) && (
                                              <button
                                                style={{
                                                  color: colors.$3,
                                                  backgroundColor: colors.$1,
                                                }}
                                                className="w-full py-2 rounded-bl"
                                                onClick={() =>
                                                  handleCurrentTask(
                                                    card.id,
                                                    'view'
                                                  )
                                                }
                                              >
                                                {t('view')}
                                              </button>
                                            )}

                                            {(hasPermission('edit_task') ||
                                              entityAssigned(currentTask)) && (
                                              <button
                                                style={{
                                                  color: colors.$3,
                                                  backgroundColor: colors.$1,
                                                }}
                                                className="w-full text-center py-2"
                                                onClick={() =>
                                                  handleCurrentTask(
                                                    card.id,
                                                    'edit'
                                                  )
                                                }
                                              >
                                                {t('edit')}
                                              </button>
                                            )}

                                            {isTaskRunning(card.task) &&
                                              (hasPermission('edit_task') ||
                                                entityAssigned(
                                                  currentTask
                                                )) && (
                                                <button
                                                  style={{
                                                    color: colors.$3,
                                                    backgroundColor: colors.$1,
                                                  }}
                                                  className="w-full py-2 rounded-br"
                                                  onClick={() =>
                                                    stopTask(card.task)
                                                  }
                                                >
                                                  {t('stop')}
                                                </button>
                                              )}

                                            {!isTaskRunning(card.task) &&
                                              (hasPermission('edit_task') ||
                                                entityAssigned(
                                                  currentTask
                                                )) && (
                                                <button
                                                  style={{
                                                    color: colors.$3,
                                                    backgroundColor: colors.$1,
                                                  }}
                                                  className="w-full py-2 rounded-br"
                                                  onClick={() =>
                                                    startTask(card.task)
                                                  }
                                                >
                                                  {t('start')}
                                                </button>
                                              )}
                                          </div>
                                        </Container>
                                      )}
                                    </Draggable>
                                  ))}

                                  {dropProvided.placeholder}
                                </div>
                              </div>
                            )}
                          </Droppable>
                        </Container>
                      )}
                    </Draggable>
                  ))}

                  {columnProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {(isAdmin || isOwner) && (
            <div className="pr-6">
              <Box
                className="shadow-sm rounded border p-2 cursor-pointer"
                style={{
                  color: colors.$3,
                  borderColor: colors.$21,
                }}
                theme={{
                  backgroundColor: colors.$1,
                  hoverBackgroundColor: colors.$4,
                }}
                onClick={() => setIsTaskStatusModalOpened(true)}
              >
                <Plus size="1.3rem" color={colors.$3} />
              </Box>
            </div>
          )}
        </div>
      )}

      <CreateTaskStatusModal
        visible={isTaskStatusModalOpened}
        setVisible={setIsTaskStatusModalOpened}
      />

      <CreateTaskModal
        visible={isTaskModalOpened}
        setVisible={setIsTaskModalOpened}
        details={taskDetails}
        apiEndPoint={apiEndpoint}
      />
    </Default>
  );
}
