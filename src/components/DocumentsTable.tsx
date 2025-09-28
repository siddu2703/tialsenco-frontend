/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date, endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { Document } from '$app/common/interfaces/document.interface';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdDelete,
  MdDownload,
  MdLockOutline,
  MdOutlineLockOpen,
  MdPageview,
} from 'react-icons/md';
import { Dropdown } from './dropdown/Dropdown';
import { DropdownElement } from './dropdown/DropdownElement';
import { FileIcon } from './FileIcon';
import { Icon } from './icons/Icon';
import { PasswordConfirmation } from './PasswordConfirmation';
import { Table, Tbody, Td, Th, Thead, Tr } from './tables';
import { defaultHeaders } from '$app/common/queries/common/headers';
import { useQueryClient } from 'react-query';
import { Spinner } from './Spinner';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { AxiosResponse } from 'axios';
import { useSetDocumentVisibility } from '$app/common/queries/documents';
import { useOnWrongPasswordEnter } from '$app/common/hooks/useOnWrongPasswordEnter';
import { useColorScheme } from '$app/common/colors';
import { LockOpen } from './icons/LockOpen';
import { Lock } from './icons/Lock';

interface Props {
  documents: Document[];
  onDocumentDelete?: () => unknown;
  disableEditableOptions?: boolean;
}

export interface DocumentUrl {
  documentId: string;
  url: string;
}

export function DocumentsTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const reactSettings = useReactSettings();

  const { disableEditableOptions = false } = props;

  const onWrongPasswordEnter = useOnWrongPasswordEnter();
  const setDocumentVisibility = useSetDocumentVisibility();

  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState<boolean>(false);

  const [documentId, setDocumentId] = useState<string>();

  const [documentsUrls, setDocumentsUrls] = useState<DocumentUrl[]>([]);

  const { dateFormat } = useCurrentCompanyDateFormats();

  const queryClient = useQueryClient();

  const getDocumentUrlById = (id: string) => {
    return documentsUrls.find(({ documentId }) => documentId === id)?.url;
  };

  const downloadDocument = (doc: Document, inline: boolean) => {
    toast.processing();

    queryClient
      .fetchQuery(
        ['/api/v1/documents', doc.hash],
        () =>
          request(
            'GET',
            endpoint('/documents/:hash', { hash: doc.hash }),
            { headers: defaultHeaders() },
            { responseType: 'arraybuffer' }
          ),
        { staleTime: Infinity }
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = URL.createObjectURL(blob);

        if (inline) {
          window.open(url);
          return;
        }

        const link = document.createElement('a');

        link.download = doc.name;
        link.href = url;
        link.target = '_blank';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        toast.dismiss();
      });
  };

  const destroy = (password: string, isPasswordRequired: boolean) => {
    toast.processing();

    request(
      'delete',
      endpoint('/api/v1/documents/:id', { id: documentId }),
      {},
      { headers: { 'X-Api-Password': password } }
    )
      .then(() => {
        toast.success('deleted_document');
        props.onDocumentDelete?.();
      })
      .catch((error) => {
        if (error.response?.status === 412) {
          onWrongPasswordEnter(isPasswordRequired);
          setIsPasswordConfirmModalOpen(true);
        }
      });
  };

  useEffect(() => {
    if (reactSettings.show_document_preview) {
      props.documents.forEach(async ({ id, hash, type }) => {
        const alreadyExist = documentsUrls.find(
          ({ documentId }) => documentId === id
        );

        if (!alreadyExist && (type === 'png' || type === 'jpg')) {
          const response: AxiosResponse = await queryClient.fetchQuery(
            ['documents', hash],
            () =>
              request(
                'GET',
                endpoint('/documents/:hash', { hash }),
                { headers: defaultHeaders() },
                { responseType: 'arraybuffer' }
              ),
            { staleTime: Infinity }
          );

          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          });
          const url = URL.createObjectURL(blob);

          setDocumentsUrls((currentDocumentUrls) => [
            ...currentDocumentUrls,
            { documentId: id, url },
          ]);
        }
      });
    }
  }, [reactSettings, props.documents]);

  return (
    <>
      <Table
        withoutTopBorder
        withoutLeftBorder
        withoutRightBorder
        withoutBottomBorder
      >
        <Thead>
          <Th>{t('name')}</Th>
          <Th>{t('date')}</Th>
          <Th>{t('type')}</Th>
          <Th>{t('size')}</Th>
          {!disableEditableOptions && <Th>{/* Placeholder for actions */}</Th>}
        </Thead>

        <Tbody>
          {!props.documents.length && (
            <Tr
              className="border-b"
              style={{
                borderColor: colors.$20,
              }}
            >
              <Td colSpan={5}>{t('no_records_found')}</Td>
            </Tr>
          )}

          {props.documents.map((document, index) => (
            <Tr
              key={index}
              className="border-b"
              style={{
                borderColor: colors.$20,
              }}
            >
              <Td>
                <div
                  className="flex items-center space-x-10"
                  style={{ width: 'max-content' }}
                >
                  <div className="flex items-center space-x-2">
                    <FileIcon type={document.type} />
                    <span>{document.name}</span>

                    {document.is_public ? (
                      <LockOpen color={colors.$3} size="1.4rem" />
                    ) : (
                      <Lock color={colors.$3} size="1.4rem" />
                    )}
                  </div>

                  {reactSettings.show_document_preview &&
                    (document.type === 'png' || document.type === 'jpg') && (
                      <>
                        {getDocumentUrlById(document.id) ? (
                          <img
                            src={getDocumentUrlById(document.id)}
                            style={{ width: 150, height: 75 }}
                          />
                        ) : (
                          <Spinner />
                        )}
                      </>
                    )}
                </div>
              </Td>
              <Td>{date(document.updated_at, dateFormat)}</Td>
              <Td>{document.type}</Td>
              <Td>{prettyBytes(document.size)}</Td>
              {!disableEditableOptions && (
                <Td>
                  <Dropdown label={t('actions')}>
                    <DropdownElement
                      onClick={() => {
                        downloadDocument(document, true);
                      }}
                      icon={<Icon element={MdPageview} />}
                    >
                      {t('view')}
                    </DropdownElement>

                    <DropdownElement
                      onClick={() => {
                        downloadDocument(document, false);
                      }}
                      icon={<Icon element={MdDownload} />}
                    >
                      {t('download')}
                    </DropdownElement>

                    {document.is_public ? (
                      <DropdownElement
                        onClick={() => {
                          setDocumentVisibility(document.id, false).then(() =>
                            props.onDocumentDelete?.()
                          );
                        }}
                        icon={<Icon element={MdLockOutline} />}
                      >
                        {t('set_private')}
                      </DropdownElement>
                    ) : (
                      <DropdownElement
                        onClick={() => {
                          setDocumentVisibility(document.id, true).then(() =>
                            props.onDocumentDelete?.()
                          );
                        }}
                        icon={<Icon element={MdOutlineLockOpen} />}
                      >
                        {t('set_public')}
                      </DropdownElement>
                    )}

                    <DropdownElement
                      onClick={() => {
                        setDocumentId(document.id);
                        setIsPasswordConfirmModalOpen(true);
                      }}
                      icon={<Icon element={MdDelete} />}
                    >
                      {t('delete')}
                    </DropdownElement>
                  </Dropdown>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <PasswordConfirmation
        show={isPasswordConfirmModalOpen}
        onClose={setIsPasswordConfirmModalOpen}
        onSave={destroy}
      />
    </>
  );
}
