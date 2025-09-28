/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { MarkdownEditor } from '$app/components/forms/MarkdownEditor';
import { TabGroup } from '$app/components/TabGroup';
import { useTranslation } from 'react-i18next';
import { PurchaseOrderCardProps } from './Details';
import { Dispatch, SetStateAction } from 'react';
import Toggle from '$app/components/forms/Toggle';
import { useColorScheme } from '$app/common/colors';

interface Props extends PurchaseOrderCardProps {
  isDefaultTerms: boolean;
  isDefaultFooter: boolean;
  setIsDefaultFooter: Dispatch<SetStateAction<boolean>>;
  setIsDefaultTerms: Dispatch<SetStateAction<boolean>>;
}
export function Footer(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const {
    purchaseOrder,
    handleChange,
    isDefaultTerms,
    isDefaultFooter,
    setIsDefaultFooter,
    setIsDefaultTerms,
  } = props;

  const tabs = [t('public_notes'), t('private_notes'), t('terms'), t('footer')];

  return (
    <Card
      className="col-span-12 xl:col-span-8 shadow-sm h-max"
      style={{ borderColor: colors.$24 }}
    >
      <TabGroup
        tabs={tabs}
        withoutVerticalMargin
        withHorizontalPadding
        horizontalPaddingWidth="1.5rem"
        fullRightPadding
      >
        <div className="mb-4 px-6">
          <MarkdownEditor
            value={purchaseOrder.public_notes || ''}
            onChange={(value) => handleChange('public_notes', value)}
          />
        </div>

        <div className="mb-4 px-6">
          <MarkdownEditor
            value={purchaseOrder.private_notes || ''}
            onChange={(value) => handleChange('private_notes', value)}
          />
        </div>

        <div className="px-6">
          <MarkdownEditor
            value={purchaseOrder.terms || ''}
            onChange={(value) => handleChange('terms', value)}
          />

          <Element
            className="mt-4"
            leftSide={
              <Toggle
                checked={isDefaultTerms}
                onValueChange={(value) => setIsDefaultTerms(value)}
              />
            }
            noExternalPadding
            noVerticalPadding
          >
            <span className="font-medium">{t('save_as_default_terms')}</span>
          </Element>
        </div>

        <div className="px-6">
          <MarkdownEditor
            value={purchaseOrder.footer || ''}
            onChange={(value) => handleChange('footer', value)}
          />

          <Element
            className="mt-4"
            leftSide={
              <Toggle
                checked={isDefaultFooter}
                onValueChange={(value) => setIsDefaultFooter(value)}
              />
            }
            noExternalPadding
            noVerticalPadding
          >
            <span className="font-medium">{t('save_as_default_footer')}</span>
          </Element>
        </div>
      </TabGroup>
    </Card>
  );
}
