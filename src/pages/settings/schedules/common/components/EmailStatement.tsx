/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Element } from '$app/components/cards';
import { SelectField } from '$app/components/forms';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { Client } from '$app/common/interfaces/client';
import { Parameters, Schedule } from '$app/common/interfaces/schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useClientsQuery } from '$app/common/queries/clients';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import Toggle from '$app/components/forms/Toggle';
import { atom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleXMark } from '$app/components/icons/CircleXMark';
import { useColorScheme } from '$app/common/colors';

interface Props {
  schedule: Schedule;
  handleChange: (
    property: keyof Schedule,
    value: Schedule[keyof Schedule]
  ) => void;
  errors: ValidationBag | undefined;
  page?: 'create' | 'edit';
}

export const scheduleParametersAtom = atom<Parameters | undefined>(undefined);

export function EmailStatement(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const parametersAtom = useAtomValue(scheduleParametersAtom);

  const { schedule, handleChange, errors, page } = props;

  const { data: clientsResponse } = useClientsQuery({
    enabled: page === 'edit' || Boolean(parametersAtom),
  });

  const [selectedClients, setSelectedClients] = useState<Client[]>([]);

  const handleChangeParameters = (clients: Client[]) => {
    const currentParameters = { ...schedule.parameters };
    currentParameters.clients = clients.map(({ id }) => id);

    handleChange('parameters', currentParameters);
  };

  const handleRemoveClient = (clientIndex: number) => {
    const updatedClientsList = selectedClients.filter(
      (client, index) => index !== clientIndex
    );

    handleChangeParameters(updatedClientsList);

    setSelectedClients(updatedClientsList);
  };

  useEffect(() => {
    if ((page === 'edit' || parametersAtom) && clientsResponse) {
      const clients = clientsResponse?.filter((client: Client) =>
        schedule.parameters.clients?.includes(client.id)
      );

      setSelectedClients(clients);
    }
  }, [clientsResponse]);

  return (
    <>
      <Element leftSide={t('date_range')}>
        <SelectField
          value={schedule.parameters.date_range}
          onValueChange={(value) =>
            handleChange('parameters.date_range' as keyof Schedule, value)
          }
          errorMessage={errors?.errors['parameters.date_range']}
          customSelector
          dismissable={false}
        >
          <option value="last7_days">{t('last7_days')}</option>
          <option value="last30_days">{t('last30_days')}</option>
          <option value="last365_days">{t('last365_days')}</option>
          <option value="this_month">{t('this_month')}</option>
          <option value="last_month">{t('last_month')}</option>
          <option value="this_quarter">{t('this_quarter')}</option>
          <option value="last_quarter">{t('last_quarter')}</option>
          <option value="this_year">{t('this_year')}</option>
          <option value="last_year">{t('last_year')}</option>
          <option value="all_time">{t('all_time')}</option>
        </SelectField>
      </Element>

      <Element leftSide={t('status')}>
        <SelectField
          value={schedule.parameters.status}
          onValueChange={(value) =>
            handleChange('parameters.status' as keyof Schedule, value)
          }
          errorMessage={errors?.errors['parameters.status']}
          customSelector
          dismissable={false}
        >
          <option value="all">{t('all')}</option>
          <option value="paid">{t('paid')}</option>
          <option value="unpaid">{t('unpaid')}</option>
        </SelectField>
      </Element>

      <Element leftSide={t('show_aging_table')}>
        <Toggle
          checked={schedule.parameters.show_aging_table}
          onValueChange={(value) =>
            handleChange('parameters.show_aging_table' as keyof Schedule, value)
          }
        />
      </Element>

      <Element leftSide={t('show_payments_table')}>
        <Toggle
          checked={schedule.parameters.show_payments_table}
          onValueChange={(value) =>
            handleChange(
              'parameters.show_payments_table' as keyof Schedule,
              value
            )
          }
        />
      </Element>

      <Element leftSide={t('show_credits_table')}>
        <Toggle
          checked={schedule.parameters.show_credits_table}
          onValueChange={(value) =>
            handleChange(
              'parameters.show_credits_table' as keyof Schedule,
              value
            )
          }
        />
      </Element>

      <Element leftSide={t('only_clients_with_invoices')}>
        <Toggle
          checked={schedule.parameters.only_clients_with_invoices}
          onValueChange={(value) =>
            handleChange(
              'parameters.only_clients_with_invoices' as keyof Schedule,
              value
            )
          }
        />
      </Element>

      <Element leftSide={t('client')}>
        <ClientSelector
          onChange={(client) => {
            setSelectedClients((prevState) => {
              const currentClients = [...prevState, client];
              handleChangeParameters(currentClients);

              return currentClients;
            });
          }}
          withoutAction
          clearInputAfterSelection
          exclude={schedule.parameters.clients}
        />

        <div className="flex justify-center">
          <div className="flex flex-col space-y-2 pt-3">
            {selectedClients?.map((client, index) => (
              <div
                key={client.id}
                className="flex items-center justify-between"
              >
                <span>{client.display_name}</span>

                <div
                  className="cursor-pointer ml-16"
                  onClick={() => handleRemoveClient(index)}
                >
                  <CircleXMark
                    color={colors.$16}
                    hoverColor={colors.$3}
                    borderColor={colors.$5}
                    hoverBorderColor={colors.$17}
                    size="1.6rem"
                  />
                </div>
              </div>
            ))}
          </div>

          {!selectedClients?.length && (
            <span
              className="self-center text-xl mt-4"
              style={{ color: colors.$17 }}
            >
              {t('all_clients')}
            </span>
          )}
        </div>
      </Element>
    </>
  );
}
