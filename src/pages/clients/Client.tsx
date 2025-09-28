/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useTitle } from '$app/common/hooks/useTitle';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { ResourceActions } from '$app/components/ResourceActions';
import { Tabs } from '$app/components/Tabs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '$app/components/Spinner';
import { $refetch } from '$app/common/hooks/useRefetch';
import { PreviousNextNavigation } from '$app/components/PreviousNextNavigation';
import { useClientQuery } from '$app/common/queries/clients';
import {
  ChangeTemplateModal,
  useChangeTemplate,
} from '../settings/invoice-design/pages/custom-designs/components/ChangeTemplate';
import { useHandleCompanySave } from '../settings/common/hooks/useHandleCompanySave';
import { cloneDeep, set } from 'lodash';
import { Client as ClientType } from '$app/common/interfaces/client';
import { ClientContact } from '$app/common/interfaces/client-contact';
import { useActions } from './common/hooks/useActions';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { useTabs } from './common/hooks/useTabs';
import { InputLabel } from '$app/components/forms';

export default function Client() {
  const { documentTitle, setDocumentTitle } = useTitle('edit_client');

  const [t] = useTranslation();

  const { id } = useParams();

  const navigate = useNavigate();
  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const [isPurgeOrMergeActionCalled, setIsPurgeOrMergeActionCalled] =
    useState<boolean>(false);

  const actions = useActions({
    setIsPurgeOrMergeActionCalled,
  });

  const { data, isLoading } = useClientQuery({
    id,
    enabled: !isPurgeOrMergeActionCalled,
  });

  const [client, setClient] = useState<ClientType>();
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Partial<ClientContact>[]>([]);

  const tabs = useTabs({ client });

  useEffect(() => {
    if (data) {
      setClient({ ...data });

      const contacts = cloneDeep(data.contacts);

      contacts.map((contact) => (contact.password = ''));

      setContacts(contacts);
    }

    return () => {
      setIsPurgeOrMergeActionCalled(false);
    };
  }, [data]);

  useEffect(() => {
    setDocumentTitle(client?.display_name || 'edit_client');
  }, [client]);

  useEffect(() => {
    setClient((client) => set(client as ClientType, 'contacts', contacts));
  }, [contacts]);

  const pages: Page[] = [
    { name: t('clients'), href: '/clients' },
    {
      name: documentTitle,
      href: route('/clients/:id', { id }),
    },
    {
      name: t('edit'),
      href: route('/clients/:id', { id }),
    },
  ];

  const saveCompany = useHandleCompanySave();

  const onSave = async () => {
    if (isFormBusy) {
      return;
    }

    toast.processing();
    setIsFormBusy(true);

    await saveCompany({ excludeToasters: true });

    request('PUT', endpoint('/api/v1/clients/:id', { id }), {
      ...client,
      documents: [],
    })
      .then(() => {
        toast.success('updated_client');

        $refetch(['clients']);

        navigate(route('/clients/:id', { id }));
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          toast.dismiss();
          setErrors(error.response.data);
        }
      })
      .finally(() => setIsFormBusy(false));
  };

  const {
    changeTemplateVisible,
    setChangeTemplateVisible,
    changeTemplateResources,
  } = useChangeTemplate();

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      {...((hasPermission('edit_client') || entityAssigned(client)) &&
        client && {
          navigationTopRight: (
            <ResourceActions
              resource={client}
              actions={actions}
              onSaveClick={onSave}
              disableSaveButton={!client || isFormBusy}
              cypressRef="clientActionDropdown"
            />
          ),
        })}
      afterBreadcrumbs={<PreviousNextNavigation entity="client" />}
    >
      {isLoading && <Spinner />}

      {client && (
        <div className="space-y-4">
          <Tabs tabs={tabs} />

          <Outlet
            context={{
              errors,
              setErrors,
              client,
              setClient,
              contacts,
              setContacts,
            }}
          />

          <ChangeTemplateModal<ClientType>
            entity="client"
            entities={changeTemplateResources as ClientType[]}
            visible={changeTemplateVisible}
            setVisible={setChangeTemplateVisible}
            labelFn={(client) => (
              <div className="flex flex-col space-y-1">
                <InputLabel>{t('number')}</InputLabel>

                <span>{client.number}</span>
              </div>
            )}
            bulkLabelFn={(client) => (
              <div className="flex space-x-2">
                <InputLabel>{t('number')}:</InputLabel>

                <span>{client.number}</span>
              </div>
            )}
            bulkUrl="/api/v1/clients/bulk"
          />
        </div>
      )}
    </Default>
  );
}
