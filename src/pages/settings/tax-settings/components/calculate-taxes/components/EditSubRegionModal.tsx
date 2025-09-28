/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Button, InputField } from '$app/components/forms';
import { Modal } from '$app/components/Modal';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TaxSetting } from '$app/common/interfaces/company.interface';
import { useHandleCurrentCompanyChangeProperty } from '$app/pages/settings/common/hooks/useHandleCurrentCompanyChange';
import { NumberInputField } from '$app/components/forms/NumberInputField';

interface Props {
  region: string;
  subregion: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  taxSetting: TaxSetting;
}

export function EditSubRegionModal(props: Props) {
  const [t] = useTranslation();

  const { visible, setVisible, region, subregion, taxSetting } = props;

  const handleChange = useHandleCurrentCompanyChangeProperty();

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={`${region} - ${subregion}`}
      visible={visible}
      onClose={closeModal}
    >
      <InputField
        label={t('tax_name')}
        value={taxSetting.tax_name}
        onValueChange={(value) =>
          handleChange(
            `tax_data.regions.${region}.subregions.${subregion}.tax_name`,
            value
          )
        }
      />

      <NumberInputField
        label={t('tax_rate')}
        value={taxSetting.tax_rate || ''}
        onValueChange={(value) =>
          handleChange(
            `tax_data.regions.${region}.subregions.${subregion}.tax_rate`,
            parseFloat(value)
          )
        }
      />

      <NumberInputField
        label={t('reduced_rate')}
        value={taxSetting.reduced_tax_rate || ''}
        onValueChange={(value) =>
          handleChange(
            `tax_data.regions.${region}.subregions.${subregion}.reduced_tax_rate`,
            parseFloat(value)
          )
        }
      />

      <Button
        className="self-end"
        behavior="button"
        onClick={closeModal}
        disableWithoutIcon
      >
        {t('save')}
      </Button>
    </Modal>
  );
}
