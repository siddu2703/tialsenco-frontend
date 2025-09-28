/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { activeSettingsAtom } from '$app/common/atoms/settings';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Client } from '$app/common/interfaces/client';
import { injectInChanges } from '$app/common/stores/slices/company-users';
import { setActiveSettings } from '$app/common/stores/slices/settings';
import { useSetAtom } from 'jotai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Params {
  withoutNavigation: boolean;
}

export function useConfigureClientSettings(params?: Params) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const company = useCurrentCompany();
  const companyChanges = useCompanyChanges();

  const { withoutNavigation } = params || {};

  const setActiveSettingsAtom = useSetAtom(activeSettingsAtom);

  return (client: Client) => {
    setActiveSettingsAtom(client);

    if (!companyChanges) {
      dispatch(
        injectInChanges({
          object: 'company',
          data: {
            ...company,
            settings: { id: client.id, ...client.settings },
            e_invoice: client.e_invoice || {},
          },
        })
      );
    } else {
      dispatch(
        injectInChanges({
          object: 'company',
          data: {
            ...companyChanges,
            settings: { id: client.id, ...client.settings },
            e_invoice: client.e_invoice || {},
          },
        })
      );
    }

    dispatch(
      setActiveSettings({
        status: {
          name: client.display_name,
          level: 'client',
        },
      })
    );

    !withoutNavigation && navigate('/settings/company_details');
  };
}
