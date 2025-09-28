/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { InputField, SelectField } from '$app/components/forms';
import { Element } from '$app/components/cards';
import { CustomField } from '$app/components/CustomField';
import { TaxRateSelector } from '$app/components/tax-rates/TaxRateSelector';
import Toggle from '$app/components/forms/Toggle';
import { Product } from '$app/common/interfaces/product';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { EntityStatus } from '$app/components/EntityStatus';
import { useSearchParams } from 'react-router-dom';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useTaxCategories } from '$app/components/tax-rates/TaxCategorySelector';
import { getTaxRateComboValue } from '$app/common/helpers/tax-rates/tax-rates-combo';
import { ErrorMessage } from '$app/components/ErrorMessage';

interface Props {
  type?: 'create' | 'edit';
  product: Product;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof Product,
    value: Product[keyof Product]
  ) => void;
}

export function ProductForm(props: Props) {
  const [t] = useTranslation();
  const [, setSearchParams] = useSearchParams();

  const company = useCurrentCompany();
  const taxCategories = useTaxCategories();

  const { errors, handleChange, type, product } = props;

  return (
    <>
      {type === 'edit' && (
        <Element leftSide={t('status')}>
          <EntityStatus entity={product} />
        </Element>
      )}

      <Element leftSide={t('item')} required>
        <InputField
          required
          value={product.product_key}
          onValueChange={(value) => handleChange('product_key', value)}
          errorMessage={errors?.errors.product_key}
        />
      </Element>

      <Element leftSide={t('description')}>
        <InputField
          element="textarea"
          value={product.notes}
          onValueChange={(value) => handleChange('notes', value)}
          errorMessage={errors?.errors.notes}
        />
      </Element>

      <Element leftSide={t('price')}>
        <NumberInputField
          value={product.price || ''}
          onValueChange={(value) => handleChange('price', parseFloat(value))}
          errorMessage={errors?.errors.price}
        />
      </Element>

      {company?.enable_product_cost && (
        <Element leftSide={t('cost')}>
          <NumberInputField
            value={product.cost || ''}
            onValueChange={(value) => handleChange('cost', parseFloat(value))}
            errorMessage={errors?.errors.cost}
          />
        </Element>
      )}

      {company?.enable_product_quantity && (
        <Element leftSide={t('default_quantity')}>
          <NumberInputField
            value={product.quantity || ''}
            onValueChange={(value) =>
              handleChange('quantity', parseFloat(value))
            }
            errorMessage={errors?.errors.quantity}
          />
        </Element>
      )}

      <Element leftSide={t('max_quantity')}>
        <NumberInputField
          value={product.max_quantity || ''}
          onValueChange={(value) =>
            handleChange('max_quantity', parseFloat(value))
          }
          errorMessage={errors?.errors.max_quantity}
        />
      </Element>

      <Element leftSide={t('tax_category')}>
        <SelectField
          value={product.tax_id}
          onValueChange={(value) => handleChange('tax_id', value)}
          customSelector
          dismissable={false}
        >
          {taxCategories.map((taxCategory, index) => (
            <option key={index} value={taxCategory.value as string}>
              {taxCategory.label}
            </option>
          ))}
        </SelectField>

        <ErrorMessage className="mt-2">{errors?.errors.tax_id}</ErrorMessage>
      </Element>

      <Element leftSide={t('image_url')}>
        <InputField
          value={product.product_image}
          onValueChange={(value) => handleChange('product_image', value)}
          errorMessage={errors?.errors.product_image}
        />
      </Element>

      {company?.track_inventory && (
        <>
          <Element leftSide={t('stock_quantity')}>
            <NumberInputField
              value={product.in_stock_quantity || ''}
              onValueChange={(value) => {
                handleChange('in_stock_quantity', Number(value));

                if (type === 'edit') {
                  setSearchParams((params) => ({
                    ...params,
                    update_in_stock_quantity: 'true',
                  }));
                }
              }}
              errorMessage={errors?.errors.in_stock_quantity}
            />
          </Element>

          <Element leftSide={t('stock_notifications')}>
            <Toggle
              checked={product.stock_notification}
              onValueChange={(value) =>
                handleChange('stock_notification', value)
              }
            />
          </Element>

          <Element leftSide={t('notification_threshold')}>
            <NumberInputField
              value={product.stock_notification_threshold || ''}
              onValueChange={(value) =>
                handleChange('stock_notification_threshold', parseFloat(value))
              }
              errorMessage={errors?.errors.stock_notification_threshold}
            />
          </Element>
        </>
      )}

      {/* Tile-specific Fields */}
      <Element leftSide={t('tile_type')}>
        <SelectField
          value={product.tile_type || ''}
          onValueChange={(value) => handleChange('tile_type', value)}
          errorMessage={errors?.errors.tile_type}
        >
          <option value="">Select Tile Type</option>
          <option value="Floor">Floor</option>
          <option value="Wall">Wall</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Bathroom">Bathroom</option>
        </SelectField>
      </Element>

      <Element leftSide={t('tile_size')}>
        <InputField
          value={product.tile_size || ''}
          onValueChange={(value) => handleChange('tile_size', value)}
          errorMessage={errors?.errors.tile_size}
          placeholder="e.g. 600x600mm"
        />
      </Element>

      <Element leftSide={t('tile_color')}>
        <InputField
          value={product.tile_color || ''}
          onValueChange={(value) => handleChange('tile_color', value)}
          errorMessage={errors?.errors.tile_color}
          placeholder="e.g. White, Beige, Grey"
        />
      </Element>

      <Element leftSide={t('tile_finish')}>
        <SelectField
          value={product.tile_finish || ''}
          onValueChange={(value) => handleChange('tile_finish', value)}
          errorMessage={errors?.errors.tile_finish}
        >
          <option value="">Select Finish</option>
          <option value="Gloss">Gloss</option>
          <option value="Matt">Matt</option>
          <option value="Satin">Satin</option>
          <option value="Polished">Polished</option>
          <option value="Unglazed">Unglazed</option>
        </SelectField>
      </Element>

      <Element leftSide={t('tile_material')}>
        <SelectField
          value={product.tile_material || ''}
          onValueChange={(value) => handleChange('tile_material', value)}
          errorMessage={errors?.errors.tile_material}
        >
          <option value="">Select Material</option>
          <option value="Ceramic">Ceramic</option>
          <option value="Porcelain">Porcelain</option>
          <option value="Vitrified">Vitrified</option>
          <option value="Stone">Stone</option>
          <option value="Marble">Marble</option>
          <option value="Granite">Granite</option>
        </SelectField>
      </Element>

      <Element leftSide={t('tile_thickness')}>
        <InputField
          value={product.tile_thickness || ''}
          onValueChange={(value) => handleChange('tile_thickness', value)}
          errorMessage={errors?.errors.tile_thickness}
          placeholder="e.g. 10mm"
        />
      </Element>

      <Element leftSide={t('tile_grade')}>
        <SelectField
          value={product.tile_grade || ''}
          onValueChange={(value) => handleChange('tile_grade', value)}
          errorMessage={errors?.errors.tile_grade}
        >
          <option value="">Select Grade</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
        </SelectField>
      </Element>

      <Element leftSide={t('pieces_per_box')}>
        <NumberInputField
          value={product.pieces_per_box || ''}
          onValueChange={(value) =>
            handleChange('pieces_per_box', parseInt(value))
          }
          errorMessage={errors?.errors.pieces_per_box}
        />
      </Element>

      <Element leftSide={t('coverage_area_per_box')}>
        <NumberInputField
          value={product.coverage_area_per_box || ''}
          onValueChange={(value) =>
            handleChange('coverage_area_per_box', parseFloat(value))
          }
          errorMessage={errors?.errors.coverage_area_per_box}
          placeholder="sq.ft or sq.m"
        />
      </Element>

      <Element leftSide={t('brand')}>
        <InputField
          value={product.brand || ''}
          onValueChange={(value) => handleChange('brand', value)}
          errorMessage={errors?.errors.brand}
        />
      </Element>

      <Element leftSide={t('collection')}>
        <InputField
          value={product.collection || ''}
          onValueChange={(value) => handleChange('collection', value)}
          errorMessage={errors?.errors.collection}
        />
      </Element>

      <Element leftSide={t('batch_number')}>
        <InputField
          value={product.batch_number || ''}
          onValueChange={(value) => handleChange('batch_number', value)}
          errorMessage={errors?.errors.batch_number}
        />
      </Element>

      <Element leftSide={t('manufacturing_date')}>
        <InputField
          type="date"
          value={product.manufacturing_date || ''}
          onValueChange={(value) => handleChange('manufacturing_date', value)}
          errorMessage={errors?.errors.manufacturing_date}
        />
      </Element>

      <Element leftSide={t('hsn_code')}>
        <InputField
          value={product.hsn_code || ''}
          onValueChange={(value) => handleChange('hsn_code', value)}
          errorMessage={errors?.errors.hsn_code}
          placeholder="e.g. 6907"
        />
      </Element>

      <Element leftSide={t('gst_rate')}>
        <NumberInputField
          value={product.gst_rate || ''}
          onValueChange={(value) => handleChange('gst_rate', parseFloat(value))}
          errorMessage={errors?.errors.gst_rate}
          placeholder="%"
        />
      </Element>

      <Element leftSide={t('country_of_origin')}>
        <InputField
          value={product.country_of_origin || ''}
          onValueChange={(value) => handleChange('country_of_origin', value)}
          errorMessage={errors?.errors.country_of_origin}
          placeholder="e.g. India"
        />
      </Element>

      {company && company.enabled_item_tax_rates > 0 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            onChange={(value) => {
              handleChange('tax_rate1', value.resource?.rate);
              handleChange('tax_name1', value.resource?.name);
            }}
            defaultValue={getTaxRateComboValue(product, 'tax_name1')}
            onClearButtonClick={() => {
              handleChange('tax_rate1', 0);
              handleChange('tax_name1', '');
            }}
            onTaxCreated={(taxRate) => {
              handleChange('tax_rate1', taxRate.rate);
              handleChange('tax_name1', taxRate.name);
            }}
          />
        </Element>
      )}

      {company && company.enabled_item_tax_rates > 1 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            onChange={(value) => {
              handleChange('tax_rate2', value.resource?.rate);
              handleChange('tax_name2', value.resource?.name);
            }}
            defaultValue={getTaxRateComboValue(product, 'tax_name2')}
            onClearButtonClick={() => {
              handleChange('tax_rate2', 0);
              handleChange('tax_name2', '');
            }}
            onTaxCreated={(taxRate) => {
              handleChange('tax_rate2', taxRate.rate);
              handleChange('tax_name2', taxRate.name);
            }}
          />
        </Element>
      )}

      {company && company.enabled_item_tax_rates > 2 && (
        <Element leftSide={t('tax')}>
          <TaxRateSelector
            onChange={(value) => {
              handleChange('tax_rate3', value.resource?.rate);
              handleChange('tax_name3', value.resource?.name);
            }}
            defaultValue={getTaxRateComboValue(product, 'tax_name3')}
            onClearButtonClick={() => {
              handleChange('tax_rate3', 0);
              handleChange('tax_name3', '');
            }}
            onTaxCreated={(taxRate) => {
              handleChange('tax_rate3', taxRate.rate);
              handleChange('tax_name3', taxRate.name);
            }}
          />
        </Element>
      )}

      {company?.custom_fields?.product1 && (
        <CustomField
          field="custom_value1"
          defaultValue={product.custom_value1}
          value={company.custom_fields.product1}
          onValueChange={(value) => handleChange('custom_value1', value)}
        />
      )}

      {company?.custom_fields?.product2 && (
        <CustomField
          field="custom_value2"
          defaultValue={product.custom_value2}
          value={company.custom_fields.product2}
          onValueChange={(value) => handleChange('custom_value2', value)}
        />
      )}

      {company?.custom_fields?.product3 && (
        <CustomField
          field="custom_value3"
          defaultValue={product.custom_value3}
          value={company.custom_fields.product3}
          onValueChange={(value) => handleChange('custom_value3', value)}
        />
      )}

      {company?.custom_fields?.product4 && (
        <CustomField
          field="custom_value4"
          defaultValue={product.custom_value4}
          value={company.custom_fields.product4}
          onValueChange={(value) => handleChange('custom_value4', value)}
        />
      )}
    </>
  );
}
