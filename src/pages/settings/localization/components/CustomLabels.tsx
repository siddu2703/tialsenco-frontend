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
import {
  injectInChanges,
  updateChanges,
} from '$app/common/stores/slices/company-users';
import { Divider } from '$app/components/cards/Divider';
import { Modal } from '$app/components/Modal';
import { cloneDeep } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Element } from '../../../../components/cards';
import {
  Button,
  InputField,
  Link,
  SelectField,
} from '../../../../components/forms';
import { useColorScheme } from '$app/common/colors';
import { CircleXMark } from '$app/components/icons/CircleXMark';

export function CustomLabels() {
  const [t] = useTranslation();

  const dispatch = useDispatch();

  const colors = useColorScheme();
  const companyChanges = useCompanyChanges();

  const [customLabel, setCustomLabel] = useState<string>('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  const defaultLabels = [
    { property: 'amount', translation: t('amount') },
    { property: 'address2', translation: t('address2') },
    { property: 'balance', translation: t('balance') },
    { property: 'country', translation: t('country') },
    { property: 'credit', translation: t('credit') },
    { property: 'credit_card', translation: t('credit_card') },
    { property: 'date', translation: t('date') },
    { property: 'description', translation: t('description') },
    { property: 'details', translation: t('details') },
    { property: 'discount', translation: t('discount') },
    { property: 'due_date', translation: t('due_date') },
    { property: 'email', translation: t('email') },
    { property: 'from', translation: t('from') },
    { property: 'hours', translation: t('hours') },
    { property: 'id_number', translation: t('id_number') },
    { property: 'invoice', translation: t('invoice') },
    { property: 'item', translation: t('item') },
    { property: 'line_total', translation: t('line_total') },
    { property: 'po_number', translation: t('po_number') },
    { property: 'paid_to_date', translation: t('paid_to_date') },
    { property: 'partial_due', translation: t('partial_due') },
    { property: 'payment_date', translation: t('payment_date') },
    { property: 'phone', translation: t('phone') },
    { property: 'quantity', translation: t('quantity') },
    { property: 'quote', translation: t('quote') },
    { property: 'rate', translation: t('rate') },
    { property: 'service', translation: t('service') },
    { property: 'statement', translation: t('statement') },
    { property: 'address1', translation: t('address1') },
    { property: 'subtotal', translation: t('subtotal') },
    { property: 'surcharge', translation: t('surcharge') },
    { property: 'tax', translation: t('tax') },
    { property: 'taxes', translation: t('taxes') },
    { property: 'terms', translation: t('terms') },
    { property: 'to', translation: t('to') },
    { property: 'total', translation: t('total') },
    { property: 'unit_cost', translation: t('unit_cost') },
    { property: 'vat_number', translation: t('vat_number') },
    { property: 'valid_until', translation: t('valid_until') },
    { property: 'website', translation: t('website') },
  ];

  const [defaultLabelsFiltered, setDefaultLabelsFiltered] =
    useState<{ property: string; translation: string }[]>(defaultLabels);

  useEffect(() => {
    const translations = Object.keys(
      companyChanges?.settings?.translations ?? []
    );

    setDefaultLabelsFiltered(
      defaultLabels.filter((label) => !translations.includes(label.property))
    );
  }, [companyChanges]);

  const labelLeftSide = (property: string): string => {
    const possibleDefault = defaultLabels.find(
      (label) => label.property === property
    );

    return possibleDefault ? possibleDefault.translation : t(property);
  };

  const handleSelectChange = (property: string): void => {
    const company = cloneDeep(companyChanges);

    if (
      company.settings.translations?.length <= 1 ||
      !company.settings.translations
    ) {
      company.settings.translations = {};
    }

    company.settings.translations[property] = '';

    dispatch(injectInChanges({ object: 'company', data: company }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateChanges({
        object: 'company',
        property: event.target.id,
        value: event.target.value,
      })
    );

  const handleDelete = (translation: string) => {
    const company = cloneDeep(companyChanges);

    delete company?.settings?.translations[translation];

    dispatch(injectInChanges({ object: 'company', data: company }));
  };

  return (
    <>
      <Modal
        title={t('add_custom')}
        visible={isCustomModalOpen}
        onClose={setIsCustomModalOpen}
      >
        <InputField
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setCustomLabel(event.target.value)
          }
          id="custom_field"
          label={t('custom_field')}
        ></InputField>

        <Button
          onClick={() => {
            handleSelectChange(customLabel);
            setCustomLabel('');
            setIsCustomModalOpen(false);
          }}
        >
          {t('submit')}
        </Button>

        <Link
          external
          to="https://github.com/tilsenco/tilsenco/blob/master/resources/lang/en/texts.php"
        >
          {t('labels')}
        </Link>
      </Modal>

      <Element
        leftSide={
          <SelectField
            onValueChange={(value) => handleSelectChange(value)}
            customSelector
            clearAfterSelection
          >
            <option value=""></option>
            {defaultLabelsFiltered.map((label) => (
              <option key={label.property} value={label.property}>
                {label.translation}
              </option>
            ))}
          </SelectField>
        }
      >
        <Button
          behavior="button"
          type="secondary"
          onClick={() => setIsCustomModalOpen(true)}
        >
          {t('add_custom')}
        </Button>
      </Element>

      {Object.keys(companyChanges?.settings?.translations ?? []).length > 0 && (
        <div className="px-4 sm:px-6  pt-2 pb-4">
          <Divider
            className="border-dashed"
            withoutPadding
            borderColor={colors.$20}
          />
        </div>
      )}

      {Object.keys(companyChanges?.settings?.translations ?? []).map(
        (translation) => (
          <Element leftSide={labelLeftSide(translation)} key={translation}>
            <div className="flex items-center space-x-4">
              <InputField
                value={
                  companyChanges?.settings?.translations[translation] || ''
                }
                onChange={handleChange}
                id={`settings.translations.${translation}`}
              />

              <div
                className="cursor-pointer"
                onClick={() => handleDelete(translation)}
              >
                <CircleXMark
                  color={colors.$16}
                  hoverColor={colors.$3}
                  borderColor={colors.$5}
                  hoverBorderColor={colors.$17}
                  size="1.6rem"
                />
              </div>
            </div>
          </Element>
        )
      )}
    </>
  );
}
