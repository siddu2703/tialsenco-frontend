/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { SelectOption } from '$app/components/datatables/Actions';
import { useDataTablePreference } from './useDataTablePreference';
import { PerPage } from '$app/components/DataTable';
import { cloneDeep, isEqual, set } from 'lodash';
import { User } from '../interfaces/user';
import { $refetch } from './useRefetch';
import { GenericSingleResourceResponse } from '../interfaces/generic-api-response';
import { CompanyUser } from '../interfaces/company-user';
import { endpoint } from '../helpers';
import { request } from '../helpers/request';
import { useDispatch } from 'react-redux';
import { injectInChangesWithData, updateUser } from '../stores/slices/user';
import { useStoreSessionTableFilters } from './useStoreSessionTableFilters';
import { useCurrentUser } from './useCurrentUser';

interface Params {
  apiEndpoint: URL;
  customFilters?: SelectOption[];
  tableKey: string | undefined;
  isInitialConfiguration: boolean;
  customFilter: string[] | undefined;
  setFilter: Dispatch<SetStateAction<string>>;
  setCustomFilter: Dispatch<SetStateAction<string[] | undefined>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setSort: Dispatch<SetStateAction<string>>;
  setSortedBy: Dispatch<SetStateAction<string | undefined>>;
  setStatus: Dispatch<SetStateAction<string[]>>;
  setPerPage: Dispatch<SetStateAction<PerPage>>;
  setArePreferencesApplied: Dispatch<SetStateAction<boolean>>;
  withoutStoringPerPage: boolean;
  enableSavingFilterPreference?: boolean;
  withoutStoringPage?: boolean;
}

export function useDataTablePreferences(params: Params) {
  const user = useCurrentUser();
  const dispatch = useDispatch();

  const currentUserRef = useRef<User | undefined>();

  const {
    apiEndpoint,
    customFilters,
    tableKey,
    isInitialConfiguration,
    customFilter,
    setFilter,
    setCustomFilter,
    setCurrentPage,
    setSort,
    setSortedBy,
    setStatus,
    setPerPage,
    setArePreferencesApplied,
    withoutStoringPerPage,
    enableSavingFilterPreference,
    withoutStoringPage,
  } = params;

  const getPreference = useDataTablePreference({ tableKey });
  const storeSessionTableFilters = useStoreSessionTableFilters({ tableKey });

  const handleUpdateUserPreferences = (updatedUser: User) => {
    request(
      'PUT',
      endpoint('/api/v1/company_users/:id', { id: updatedUser.id }),
      updatedUser
    ).then((response: GenericSingleResourceResponse<CompanyUser>) => {
      set(updatedUser, 'company_user', response.data.data);

      $refetch(['company_users']);

      currentUserRef.current = updatedUser;
    });
  };

  const handleUpdateTableFilters = (
    filter: string,
    sortedBy: string | undefined,
    sort: string,
    currentPage: number,
    status: string[],
    perPage: PerPage
  ) => {
    if (!customFilter || !tableKey || !enableSavingFilterPreference) {
      return;
    }

    const currentTableFilters =
      user?.company_user?.react_settings.table_filters?.[tableKey];

    const defaultFilters = {
      ...(customFilters && { customFilter: [] }),
      sort: apiEndpoint.searchParams.get('sort') || 'id|asc',
      status: ['active'],
      ...(!withoutStoringPerPage && { perPage: '10' }),
      ...(!withoutStoringPage && { currentPage: 1 }),
    };

    const cleanedUpFilters = {
      ...(sortedBy && { sortedBy }),
      ...(customFilters && { customFilter }),
      sort,
      status,
      ...(!withoutStoringPerPage && { perPage }),
      ...(!withoutStoringPage && { currentPage }),
    };

    if (currentTableFilters && withoutStoringPerPage) {
      delete currentTableFilters.perPage;
    }

    if (currentTableFilters && withoutStoringPage) {
      delete currentTableFilters.currentPage;
    }

    storeSessionTableFilters(filter, currentPage);

    if (isEqual(defaultFilters, cleanedUpFilters) && !currentTableFilters) {
      return;
    }

    if (isEqual(currentTableFilters, cleanedUpFilters) && currentTableFilters) {
      return;
    }

    const updatedUser = cloneDeep(user) as User;

    if (updatedUser) {
      // @Todo: This is a temporary solution for creating the table_filters object. It can be removed after some time.
      const tableFilters =
        updatedUser.company_user?.react_settings.table_filters || {};

      Object.keys(tableFilters).forEach((key) => {
        if (key.includes('/')) {
          delete tableFilters[key];
        }
      });

      set(
        updatedUser,
        `company_user.react_settings.table_filters.${tableKey}`,
        cleanedUpFilters
      );

      handleUpdateUserPreferences(updatedUser as User);
    }
  };

  useEffect(() => {
    if (!isInitialConfiguration && !customFilter) {
      setFilter((getPreference('filter') as string) || '');
      if (customFilters) {
        if ((getPreference('customFilter') as string[]).length) {
          setCustomFilter(getPreference('customFilter') as string[]);
        } else {
          setCustomFilter([]);
        }
      } else {
        setCustomFilter([]);
      }
      if (!withoutStoringPerPage) {
        setPerPage((getPreference('perPage') as PerPage) || '10');
      }
      if (!withoutStoringPage) {
        setCurrentPage((getPreference('currentPage') as number) || 1);
      }
      setSort((getPreference('sort') as string) || 'id|asc');
      setSortedBy((getPreference('sortedBy') as string) || undefined);
      if ((getPreference('status') as string[]).length) {
        setStatus(getPreference('status') as string[]);
      } else {
        setStatus(['active']);
      }

      setArePreferencesApplied(true);
    }
  }, [isInitialConfiguration]);

  useEffect(() => {
    return () => {
      if (currentUserRef.current) {
        dispatch(updateUser(currentUserRef.current));
        dispatch(injectInChangesWithData(currentUserRef.current));
      }
    };
  }, []);

  return { handleUpdateTableFilters };
}
