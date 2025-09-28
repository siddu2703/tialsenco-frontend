/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { SelectOption } from '$app/components/datatables/Actions';
import { useTranslation } from 'react-i18next';

export function useDocumentFilters() {
  const [t] = useTranslation();

  const filters: SelectOption[] = [
    {
      label: t('public'),
      value: 'public',
      color: 'white',
      backgroundColor: '#6B7280',
      queryKey: 'type',
    },
    {
      label: t('private'),
      value: 'private',
      color: 'white',
      backgroundColor: '#93C5FD',
      queryKey: 'type',
    },
    {
      label: t('image'),
      value: 'image',
      color: 'white',
      backgroundColor: '#1D4ED8',
      queryKey: 'type',
    },
    {
      label: t('pdf'),
      value: 'pdf',
      color: 'white',
      backgroundColor: '#22C55E',
      queryKey: 'type',
    },
    {
      label: t('other'),
      value: 'other',
      color: 'white',
      backgroundColor: '#9CA3AF',
      queryKey: 'type',
    },
  ];

  return filters;
}
