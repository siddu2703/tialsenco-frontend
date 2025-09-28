/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { useInjectCompanyChanges } from '$app/common/hooks/useInjectCompanyChanges';
import { useTitle } from '$app/common/hooks/useTitle';
import { updateChanges } from '$app/common/stores/slices/company-users';
import { Divider } from '$app/components/cards/Divider';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Card, Element } from '../../../components/cards';
import Toggle from '../../../components/forms/Toggle';
import { Settings } from '../../../components/layouts/Settings';
import { useDiscardChanges } from '../common/hooks/useDiscardChanges';
import {
  isCompanySettingsFormBusy,
  useHandleCompanySave,
} from '../common/hooks/useHandleCompanySave';
import { useAtomValue } from 'jotai';
import { companySettingsErrorsAtom } from '../common/atoms';
import { useHandleCurrentCompanyChangeProperty } from '../common/hooks/useHandleCurrentCompanyChange';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useColorScheme } from '$app/common/colors';

export function ProductSettings() {
  useTitle('product_settings');
  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('product_settings'), href: '/settings/product_settings' },
  ];

  useInjectCompanyChanges();

  const colors = useColorScheme();
  const companyChanges = useCompanyChanges();

  const dispatch = useDispatch();
  const onCancel = useDiscardChanges();
  const onSave = useHandleCompanySave();
  const handleChange = useHandleCurrentCompanyChangeProperty();

  const errors = useAtomValue(companySettingsErrorsAtom);
  const isFormBusy = useAtomValue(isCompanySettingsFormBusy);

  const handleToggleChange = (id: string, value: boolean) => {
    dispatch(
      updateChanges({
        object: 'company',
        property: id,
        value,
      })
    );
  };

  return (
    <Settings
      onSaveClick={onSave}
      onCancelClick={onCancel}
      title={t('product_settings')}
      breadcrumbs={pages}
      docsLink="en/basic-settings/#product_settings"
      disableSaveButton={isFormBusy}
    >
      <Card
        title={t('settings')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <Element
          leftSide={t('track_inventory')}
          leftSideHelp={t('track_inventory_help')}
        >
          <Toggle
            checked={companyChanges?.track_inventory}
            onChange={(value: boolean) =>
              handleToggleChange('track_inventory', value)
            }
          />
        </Element>

        <Element
          leftSide={t('stock_notifications')}
          leftSideHelp={t('stock_notifications_help')}
        >
          <Toggle
            checked={companyChanges?.stock_notification}
            onChange={(value: boolean) =>
              handleToggleChange('stock_notification', value)
            }
          />
        </Element>

        {companyChanges?.stock_notification === true ? (
          <>
            <Element leftSide={t('notification_threshold')}>
              <NumberInputField
                precision={0}
                value={companyChanges?.inventory_notification_threshold || ''}
                onValueChange={(value) =>
                  handleChange(
                    'inventory_notification_threshold',
                    parseFloat(value)
                  )
                }
                errorMessage={errors?.errors.inventory_notification_threshold}
                disablePrecision
              />
            </Element>
          </>
        ) : (
          ''
        )}

        <div className="px-4 sm:px-6 py-4">
          <Divider
            className="border-dashed"
            style={{ borderColor: colors.$20 }}
            withoutPadding
          />
        </div>

        <Element
          leftSide={t('show_product_discount')}
          leftSideHelp={t('show_product_discount_help')}
        >
          <Toggle
            checked={companyChanges?.enable_product_discount}
            onChange={(value: boolean) =>
              handleToggleChange('enable_product_discount', value)
            }
          />
        </Element>

        <Element
          leftSide={t('show_product_cost')}
          leftSideHelp={t('show_cost_help')}
        >
          <Toggle
            checked={companyChanges?.enable_product_cost}
            onChange={(value: boolean) =>
              handleToggleChange('enable_product_cost', value)
            }
          />
        </Element>

        <Element
          leftSide={t('show_product_quantity')}
          leftSideHelp={t('show_product_quantity_help')}
        >
          <Toggle
            checked={companyChanges?.enable_product_quantity}
            onChange={(value: boolean) =>
              handleToggleChange('enable_product_quantity', value)
            }
          />
        </Element>

        <Element
          leftSide={t('default_quantity')}
          leftSideHelp={t('default_quantity_help')}
        >
          <Toggle
            checked={companyChanges?.default_quantity}
            onChange={(value: boolean) =>
              handleToggleChange('default_quantity', value)
            }
          />
        </Element>

        <div className="px-4 sm:px-6 py-4">
          <Divider
            className="border-dashed"
            style={{ borderColor: colors.$20 }}
            withoutPadding
          />
        </div>

        <Element
          leftSide={t('fill_products')}
          leftSideHelp={t('fill_products_help')}
        >
          <Toggle
            checked={companyChanges?.fill_products}
            onChange={(value: boolean) =>
              handleToggleChange('fill_products', value)
            }
          />
        </Element>

        <Element
          leftSide={t('update_products')}
          leftSideHelp={t('update_products_help')}
        >
          <Toggle
            checked={companyChanges?.update_products}
            onChange={(value: boolean) =>
              handleToggleChange('update_products', value)
            }
          />
        </Element>

        <Element
          leftSide={t('convert_products')}
          leftSideHelp={t('convert_products_help')}
        >
          <Toggle
            checked={companyChanges?.convert_products}
            onChange={(value: boolean) =>
              handleToggleChange('convert_products', value)
            }
          />
        </Element>
      </Card>
    </Settings>
  );
}
