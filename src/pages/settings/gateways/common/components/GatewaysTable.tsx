/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { EntityState } from '$app/common/enums/entity-state';
import { getEntityState } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { CompanyGateway } from '$app/common/interfaces/company-gateway';
import { useBulk } from '$app/common/queries/company-gateways';
import { EntityStatus } from '$app/components/EntityStatus';
import { Tooltip } from '$app/components/Tooltip';
import { Dropdown } from '$app/components/dropdown/Dropdown';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Button, Checkbox, Link } from '$app/components/forms';
import { Icon } from '$app/components/icons/Icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '$app/components/tables';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { arrayMoveImmutable } from 'array-move';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { Check } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { MdArchive, MdDelete, MdRestore, MdWarning } from 'react-icons/md';
import { STRIPE_CONNECT } from '../../index/Gateways';
import { useGatewayUtilities } from '../hooks/useGatewayUtilities';
import { useHandleCompanySave } from '$app/pages/settings/common/hooks/useHandleCompanySave';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import {
  Control,
  DropdownIndicator,
  MultiValueContainer,
  Option,
  SelectOption,
  SelectWithApplyButton,
  ValueContainer,
} from '$app/components/datatables/Actions';
import { Settings } from '$app/common/interfaces/company.interface';
import { useHandleCurrentCompanyChangeProperty } from '$app/pages/settings/common/hooks/useHandleCurrentCompanyChange';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { useSelectorCustomStyles } from '$app/pages/reports/common/hooks/useSelectorCustomStyles';
import { useColorScheme } from '$app/common/colors';
import { GridDotsVertical } from '$app/components/icons/GridDotsVertical';
import { CircleQuestion } from '$app/components/icons/CircleQuestion';

interface Params {
  includeRemoveAction: boolean;
  includeResetAction: boolean;
}

const BorderWrapper = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => (
  <div className="relative">
    {children}
    <div
      className="absolute left-0 right-0 bottom-0 h-px"
      style={{ backgroundColor: color }}
    />
  </div>
);

export function GatewaysTable(params: Params) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const companyChanges = useCompanyChanges();
  const { newCustomStyles } = useSelectorCustomStyles();
  const { isCompanySettingsActive } = useCurrentSettingsLevel();

  const { includeRemoveAction, includeResetAction } = params;

  const commonComponents = {
    MultiValueContainer,
    ValueContainer,
    DropdownIndicator,
    Option,
    Control,
  };

  const bulk = useBulk();
  const handleCompanySave = useHandleCompanySave();
  const handleChange = useHandleCurrentCompanyChangeProperty();

  const mainCheckbox = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [updateCompany, setUpdateCompany] = useState<boolean>(false);
  const [currentGateways, setCurrentGateways] = useState<CompanyGateway[]>([]);
  const [selectedResources, setSelectedResources] = useState<CompanyGateway[]>(
    []
  );

  const { gateways, handleRemoveGateway, handleReset, onStatusChange } =
    useGatewayUtilities({
      currentGateways,
      setCurrentGateways,
    });

  const handleDeselect = () => {
    setSelected([]);

    if (mainCheckbox.current) {
      mainCheckbox.current.checked = false;
    }
  };

  const showRestoreBulkAction = () => {
    return selectedResources.every(
      (resource) => getEntityState(resource) !== EntityState.Active
    );
  };

  const onDragEnd = (result: DropResult) => {
    const sorted = arrayMoveImmutable(
      currentGateways,
      result.source.index,
      result.destination?.index as unknown as number
    );

    handleChange(
      'settings.company_gateway_ids',
      sorted.map(({ id }) => id).join(',')
    );

    setCurrentGateways(sorted);
  };

  const showWarning = (gateway: CompanyGateway) => {
    const gatewayConfig = JSON.parse(gateway.config);

    return STRIPE_CONNECT === gateway.gateway_key && !gatewayConfig.account_id;
  };

  const handleSaveBulkActionsChanges = (ids: string[]) => {
    if (companyChanges?.settings.company_gateway_ids) {
      const numberOfGateways: number = (
        companyChanges?.settings as Settings
      ).company_gateway_ids.split(',').length;

      if (numberOfGateways > 1 || isCompanySettingsActive) {
        handleChange(
          'settings.company_gateway_ids',
          currentGateways
            .filter(({ id }) => !ids.includes(id))
            .map(({ id }) => id)
            .join(',')
        );
      } else {
        handleChange('settings.company_gateway_ids', '0');
      }

      setUpdateCompany(true);
    }
  };

  const options: SelectOption[] = [
    {
      value: 'active',
      label: t('active'),
      color: 'black',
      backgroundColor: '#e4e4e4',
    },
    {
      value: 'archived',
      label: t('archived'),
      color: 'white',
      backgroundColor: '#e6b05c',
    },
    {
      value: 'deleted',
      label: t('deleted'),
      color: 'white',
      backgroundColor: '#c95f53',
    },
  ];

  useEffect(() => {
    if (updateCompany) {
      handleCompanySave({ excludeToasters: true });

      setUpdateCompany(false);
    }
  }, [updateCompany]);

  useEffect(() => {
    if (gateways) {
      setCurrentGateways(gateways.filter((gateway) => gateway));
    }
  }, [gateways]);

  useEffect(() => {
    if (gateways) {
      const filteredSelectedResources = gateways.filter(
        (resource: CompanyGateway) => resource && selected.includes(resource.id)
      );

      setSelectedResources(filteredSelectedResources);
    }
  }, [selected]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col space-y-2 mt-2 lg:mt-0 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
          {Boolean(selected.length) && (
            <Dropdown label={t('actions')}>
              <DropdownElement
                onClick={() => {
                  bulk(selected, 'archive').then(() =>
                    handleSaveBulkActionsChanges(selected)
                  );

                  handleDeselect();
                }}
                icon={<Icon element={MdArchive} />}
              >
                {t('archive')}
              </DropdownElement>

              <DropdownElement
                onClick={() => {
                  bulk(selected, 'delete').then(() =>
                    handleSaveBulkActionsChanges(selected)
                  );

                  handleDeselect();
                }}
                icon={<Icon element={MdDelete} />}
              >
                {t('delete')}
              </DropdownElement>

              {showRestoreBulkAction() && (
                <DropdownElement
                  onClick={() => {
                    bulk(selected, 'restore');

                    handleDeselect();
                  }}
                  icon={<Icon element={MdRestore} />}
                >
                  {t('restore')}
                </DropdownElement>
              )}
            </Dropdown>
          )}

          <SelectWithApplyButton
            styles={newCustomStyles}
            defaultValue={options[0]}
            onChange={(options: SelectOption[]) => onStatusChange(options)}
            placeholder={t('status')}
            options={options}
            isMulti
            components={commonComponents}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isClearable={false}
            menuPosition="fixed"
          />
        </div>

        <div className="flex space-x-5">
          {includeResetAction && (
            <Button behavior="button" type="secondary" onClick={handleReset}>
              {t('reset')}
            </Button>
          )}

          <Button to="/settings/gateways/create">{t('add_gateway')}</Button>
        </div>
      </div>

      <Table>
        <Thead>
          <Th>
            <Checkbox
              innerRef={mainCheckbox}
              checked={
                selected.length === currentGateways.length &&
                currentGateways.length > 0
              }
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                Array.from(
                  document.querySelectorAll('.child-checkbox')
                ).forEach((checkbox: HTMLInputElement | any) => {
                  checkbox.checked = event.target.checked;

                  event.target.checked
                    ? setSelected((current) => [...current, checkbox.id])
                    : setSelected((current) =>
                        current.filter((value) => value !== checkbox.id)
                      );
                });
              }}
            />
          </Th>
          <Th>{t('status')}</Th>
          <Th>{t('label')}</Th>
          <Th>{t('test_mode')}</Th>
          <Th disableUppercase>
            <Tooltip
              placement="bottom"
              message={t('priority') as string}
              width="auto"
              withoutArrow
            >
              <CircleQuestion color={colors.$17} size="1.3rem" />
            </Tooltip>
          </Th>
        </Thead>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gateways-table">
            {(droppableProvided) => (
              <Tbody
                {...droppableProvided.droppableProps}
                innerRef={droppableProvided.innerRef}
              >
                {currentGateways.map((gateway, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Tr
                        {...provided.draggableProps}
                        innerRef={provided.innerRef}
                        key={index}
                      >
                        <Td
                          width="10%"
                          style={{
                            borderBottom:
                              index !== currentGateways.length - 1
                                ? `1px solid ${colors.$20}`
                                : 'none',
                          }}
                        >
                          <Checkbox
                            checked={selected.includes(gateway.id)}
                            className="child-checkbox"
                            value={gateway.id}
                            id={gateway.id}
                            onValueChange={(value) =>
                              selected.includes(value)
                                ? setSelected((current) =>
                                    current.filter((v) => v !== value)
                                  )
                                : setSelected((current) => [...current, value])
                            }
                          />
                        </Td>

                        <Td
                          width="30%"
                          style={{
                            borderBottom:
                              index !== currentGateways.length - 1
                                ? `1px solid ${colors.$20}`
                                : 'none',
                          }}
                        >
                          <EntityStatus entity={gateway} />
                        </Td>

                        <Td
                          width={includeRemoveAction ? '30%' : '35%'}
                          style={{
                            borderBottom:
                              index !== currentGateways.length - 1
                                ? `1px solid ${colors.$20}`
                                : 'none',
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <Link
                              to={route(
                                '/settings/gateways/:id/edit?tab=:tab',
                                {
                                  id: gateway.id,
                                  tab: showWarning(gateway) ? 1 : 0,
                                }
                              )}
                            >
                              {gateway.label}
                            </Link>

                            {showWarning(gateway) && (
                              <Tooltip
                                message={
                                  t('stripe_connect_migration_title') as string
                                }
                                width="auto"
                                placement="top"
                              >
                                <div className="flex space-x-2">
                                  <MdWarning color="red" size={22} />
                                  <MdWarning color="red" size={22} />
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </Td>

                        <Td
                          width={includeRemoveAction ? '20%' : '25%'}
                          style={{
                            borderBottom:
                              index !== currentGateways.length - 1
                                ? `1px solid ${colors.$20}`
                                : 'none',
                          }}
                        >
                          {gateway.test_mode ? <Check size={20} /> : ''}
                        </Td>

                        <Td
                          width="25%"
                          style={{
                            borderBottom:
                              index !== currentGateways.length - 1
                                ? `1px solid ${colors.$20}`
                                : 'none',
                          }}
                        >
                          <div className="flex items-center space-x-7 py-1">
                            {includeRemoveAction && (
                              <Button
                                behavior="button"
                                type="minimal"
                                onClick={() => handleRemoveGateway(gateway.id)}
                              >
                                {t('remove')}
                              </Button>
                            )}

                            <div
                              className="cursor-grab"
                              {...provided.dragHandleProps}
                            >
                              <GridDotsVertical
                                size="1.2rem"
                                color={colors.$17}
                              />
                            </div>
                          </div>
                        </Td>
                      </Tr>
                    )}
                  </Draggable>
                ))}

                {!currentGateways.length ? (
                  <Tr>
                    <Td colSpan={100}>{t('no_records_found')}.</Td>
                  </Tr>
                ) : (
                  <Fragment />
                )}

                {droppableProvided.placeholder}
              </Tbody>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </div>
  );
}
