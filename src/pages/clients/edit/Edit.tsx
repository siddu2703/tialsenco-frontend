/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from '$app/common/interfaces/client';
import { ClientContact } from '$app/common/interfaces/client-contact';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Address } from './components/Address';
import { Contacts } from './components/Contacts';
import { Details } from './components/Details';

export interface ClientContext {
  client: Client | undefined;
  setClient: Dispatch<SetStateAction<Client | undefined>>;
  contacts: Partial<ClientContact>[];
  setContacts: Dispatch<SetStateAction<Partial<ClientContact>[]>>;
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export default function Edit() {
  const context: ClientContext = useOutletContext();
  const { client, setClient, contacts, setContacts, errors, setErrors } =
    context;

  return (
    <>
      {client && (
        <div className="flex flex-col xl:flex-row xl:space-x-4">
          <div className="flex flex-col w-full xl:w-1/2 space-y-4">
            <Details
              client={client}
              setClient={setClient}
              setErrors={setErrors}
              errors={errors}
              page="edit"
            />

            <Address
              client={client}
              setClient={setClient}
              setErrors={setErrors}
              errors={errors}
            />
          </div>

          <div className="w-full xl:w-1/2">
            <Contacts
              contacts={contacts}
              setContacts={setContacts}
              setErrors={setErrors}
              errors={errors}
            />
          </div>
        </div>
      )}
    </>
  );
}
