/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import Toggle from '$app/components/forms/Toggle';
import { useTranslation } from 'react-i18next';
import { MarkdownEditor } from '$app/components/forms/MarkdownEditor';
import { Card, Element } from '$app/components/cards';
import { Link } from '$app/components/forms';
import { TabGroup } from '$app/components/TabGroup';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai';
import { quoteAtom } from '../atoms';
import { ChangeHandler } from '../hooks';
import { useColorScheme } from '$app/common/colors';

interface Props {
  handleChange: ChangeHandler;
  errors: ValidationBag | undefined;
  isDefaultTerms: boolean;
  isDefaultFooter: boolean;
  setIsDefaultFooter: Dispatch<SetStateAction<boolean>>;
  setIsDefaultTerms: Dispatch<SetStateAction<boolean>>;
}

export function QuoteFooter(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const { isAdmin, isOwner } = useAdmin();

  const {
    handleChange,
    isDefaultTerms,
    isDefaultFooter,
    setIsDefaultFooter,
    setIsDefaultTerms,
  } = props;

  const quote = useAtomValue(quoteAtom);

  const tabs = [
    t('public_notes'),
    t('private_notes'),
    t('terms'),
    t('footer'),
    ...(isAdmin || isOwner ? [t('custom_fields')] : []),
  ];

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
            value={quote?.public_notes || ''}
            onChange={(value) => handleChange('public_notes', value)}
          />
        </div>

        <div className="mb-4 px-6">
          <MarkdownEditor
            value={quote?.private_notes || ''}
            onChange={(value) => handleChange('private_notes', value)}
          />
        </div>

        <div className="px-6">
          <MarkdownEditor
            value={quote?.terms || ''}
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
            value={quote?.footer || ''}
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

        <div className="my-4 px-6">
          <span className="text-sm">{t('custom_fields')} &nbsp;</span>
          <Link to="/settings/custom_fields/invoices" className="capitalize">
            {t('click_here')}.
          </Link>
        </div>
      </TabGroup>
    </Card>
  );
}
