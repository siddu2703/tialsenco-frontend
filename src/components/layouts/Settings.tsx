/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Breadcrumbs, Page } from '$app/components/Breadcrumbs';
import { useAtom } from 'jotai';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers';
import { SelectField } from '../forms';
import { Default } from './Default';
import { companySettingsErrorsAtom } from '../../pages/settings/common/atoms';
import { ValidationAlert } from '$app/components/ValidationAlert';
import { useSettingsRoutes } from './common/hooks';
import { Icon } from '../icons/Icon';
import { MdGroup } from 'react-icons/md';
import { FaObjectGroup } from 'react-icons/fa';
import { useActiveSettingsDetails } from '$app/common/hooks/useActiveSettingsDetails';
import { useSwitchToCompanySettings } from '$app/common/hooks/useSwitchToCompanySettings';
import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { useColorScheme } from '$app/common/colors';
import { styled } from 'styled-components';
import { Sparkle } from '../icons/Sparkle';
import { XMark } from '../icons/XMark';

interface Props {
  title: string;
  children: ReactNode;
  onSaveClick?: any;
  onCancelClick?: any;
  breadcrumbs: Page[];
  docsLink?: string;
  navigationTopRight?: ReactNode;
  disableSaveButton?: boolean;
  aboveMainContainer?: ReactNode;
}

const LinkStyled = styled(Link)`
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.backgroundColor};
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

export function Settings(props: Props) {
  const [t] = useTranslation();

  const [errors, setErrors] = useAtom(companySettingsErrorsAtom);

  const location = useLocation();
  const colors = useColorScheme();
  const { basic, advanced } = useSettingsRoutes();
  const activeSettings = useActiveSettingsDetails();
  const settingPathNameKey = location.pathname.split('/')[2];
  const { isGroupSettingsActive, isClientSettingsActive } =
    useCurrentSettingsLevel();

  const navigate = useNavigate();
  const switchToCompanySettings = useSwitchToCompanySettings();

  useEffect(() => {
    setErrors(undefined);
  }, [settingPathNameKey]);

  return (
    <Default
      onSaveClick={props.onSaveClick}
      onCancelClick={props.onCancelClick}
      title={props.title}
      docsLink={props.docsLink}
      navigationTopRight={props.navigationTopRight}
      disableSaveButton={props.disableSaveButton}
      breadcrumbs={[]}
      aboveMainContainer={props.aboveMainContainer}
    >
      {props.breadcrumbs && (
        <div className="w-full pl-0 lg:pl-2 pt-3 pb-2">
          <Breadcrumbs pages={props.breadcrumbs} />
        </div>
      )}

      <div className="grid grid-cols-12 lg:gap-6">
        <div className="col-span-12 lg:col-span-3">
          {(isGroupSettingsActive || isClientSettingsActive) && (
            <div
              className="flex items-center justify-between border py-3 space-x-3 px-3 rounded-md shadow-sm"
              style={{
                backgroundColor: colors.$1,
                borderColor: colors.$24,
              }}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div>
                  <Icon
                    element={isGroupSettingsActive ? FaObjectGroup : MdGroup}
                    size={20}
                  />
                </div>

                <span className="text-sm truncate">
                  {isGroupSettingsActive
                    ? t('group_settings')
                    : t('client_settings')}
                  : {activeSettings.name}
                </span>
              </div>

              <div
                className="cursor-pointer hover:opacity-75"
                onClick={() => {
                  switchToCompanySettings();

                  isGroupSettingsActive && navigate('/settings/group_settings');
                  isClientSettingsActive && navigate('/clients');
                }}
              >
                <XMark color={colors.$3} size="1rem" />
              </div>
            </div>
          )}

          <a className="flex items-center mb-3 mt-4 px-0 lg:px-3 text-sm font-medium">
            <span className="truncate" style={{ color: colors.$17 }}>
              {t('basic_settings')}
            </span>
          </a>

          <SelectField
            className="lg:hidden text-sm"
            value={location.pathname}
            onValueChange={(value) => navigate(value)}
            withBlank
            customSelector
          >
            {basic
              .filter((item) => item.enabled)
              .map((item) => (
                <option key={item.name} value={item.href}>
                  {item.name}
                </option>
              ))}
          </SelectField>

          <nav className="space-y-1 hidden lg:block" aria-label="Sidebar">
            {basic.map(
              (item) =>
                item.enabled && (
                  <LinkStyled
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    theme={{
                      backgroundColor: item.current ? colors.$20 : '',
                      color: item.current ? colors.$3 : '',
                      hoverColor: colors.$20,
                    }}
                  >
                    <span className="truncate">{item.name}</span>
                  </LinkStyled>
                )
            )}
          </nav>

          {advanced.filter((route) => route.enabled).length > 0 && (
            <div className="flex items-center mb-3 mt-8 px-0 lg:px-3 text-sm font-medium truncate space-x-2">
              <span style={{ color: colors.$17 }}>
                {t('advanced_settings')}
              </span>

              <div className="flex space-x-0.5 items-center text-xs py-1 px-2 bg-[#2176FF26] rounded">
                <div>
                  <Sparkle size="1rem" color="#2176FF" />
                </div>

                <span className="font-medium" style={{ color: '#2176FF' }}>
                  {t('pro')}
                </span>
              </div>
            </div>
          )}

          <SelectField
            className="lg:hidden text-sm"
            value={location.pathname}
            onValueChange={(value) => navigate(value)}
            withBlank
            customSelector
          >
            {advanced
              .filter((item) => item.enabled)
              .map((item) => (
                <option key={item.name} value={item.href}>
                  {item.name}
                </option>
              ))}
          </SelectField>

          <nav className="space-y-1 hidden lg:block" aria-label="Sidebar">
            {advanced.map((item, index) => (
              <div key={index}>
                {item.enabled && (
                  <LinkStyled
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    theme={{
                      backgroundColor: item.current ? colors.$20 : '',
                      color: item.current ? colors.$3 : '',
                      hoverColor: colors.$20,
                    }}
                  >
                    <span className="truncate">{item.name}</span>
                  </LinkStyled>
                )}

                {item.children && item.current && (
                  <div className="bg-gray-100 space-y-4 py-3 rounded-b">
                    {item.children &&
                      item.children.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className={classNames(
                            item.current ? 'text-gray-900 font-semibold' : '',
                            'ml-4 px-3 text-sm block text-gray-700 hover:text-gray-900 transition duration-200 ease-in-out'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="col-span-12 lg:col-start-4 space-y-6 mt-4">
          {errors && <ValidationAlert errors={errors} />}

          {props.children}
        </div>
      </div>
    </Default>
  );
}
