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
import { InputField } from '$app/components/forms';
import { isSelfHosted } from '$app/common/helpers';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { useHandleCurrentCompanyChangeProperty } from '$app/pages/settings/common/hooks/useHandleCurrentCompanyChange';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';
import { companySettingsErrorsAtom } from '../../common/atoms';
import { useDisableSettingsField } from '$app/common/hooks/useDisableSettingsField';
import { PropertyCheckbox } from '$app/components/PropertyCheckbox';
import { SettingsLabel } from '$app/components/SettingsLabel';
import { useColorScheme } from '$app/common/colors';

export function Customize() {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const company = useCompanyChanges();

  const disableSettingsField = useDisableSettingsField();
  const handleChange = useHandleCurrentCompanyChangeProperty();

  const errors = useAtomValue(companySettingsErrorsAtom);

  return (
    <>
      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="portal_custom_head"
            labelElement={<SettingsLabel label={t('header')} />}
          />
        }
      >
        <InputField
          element="textarea"
          value={company?.settings.portal_custom_head || ''}
          onValueChange={(value) =>
            handleChange('settings.portal_custom_head', value)
          }
          disabled={disableSettingsField('portal_custom_head')}
          errorMessage={errors?.errors['settings.portal_custom_head']}
        />
      </Element>

      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="portal_custom_footer"
            labelElement={<SettingsLabel label={t('footer')} />}
          />
        }
      >
        <InputField
          element="textarea"
          value={company?.settings.portal_custom_footer || ''}
          onValueChange={(value) =>
            handleChange('settings.portal_custom_footer', value)
          }
          disabled={disableSettingsField('portal_custom_footer')}
          errorMessage={errors?.errors['settings.portal_custom_footer']}
        />
      </Element>

      {isSelfHosted() && (
        <>
          <Element
            leftSide={
              <PropertyCheckbox
                propertyKey="portal_custom_css"
                labelElement={<SettingsLabel label={t('custom_css')} />}
              />
            }
          >
            <InputField
              element="textarea"
              value={company?.settings.portal_custom_css || ''}
              onValueChange={(value) =>
                handleChange('settings.portal_custom_css', value)
              }
              disabled={disableSettingsField('portal_custom_css')}
              errorMessage={errors?.errors['settings.portal_custom_css']}
            />
          </Element>

          <Element
            leftSide={
              <PropertyCheckbox
                propertyKey="portal_custom_js"
                labelElement={<SettingsLabel label={t('custom_javascript')} />}
              />
            }
          >
            <InputField
              element="textarea"
              value={company?.settings.portal_custom_js || ''}
              onValueChange={(value) =>
                handleChange('settings.portal_custom_js', value)
              }
              disabled={disableSettingsField('portal_custom_js')}
              errorMessage={errors?.errors['settings.portal_custom_js']}
            />
          </Element>
        </>
      )}
    </>
  );
}
