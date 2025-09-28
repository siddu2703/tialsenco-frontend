/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDesignUtilities } from '../common/hooks';
import { useDebounce } from 'react-use';
import { Card } from '$app/components/cards';
import Editor from '@monaco-editor/react';
import { useColorScheme } from '$app/common/colors';
import { useOutletContext } from 'react-router-dom';
import { Context } from './Settings';

export default function Includes() {
  const context: Context = useOutletContext();

  const { payload, setPayload } = context;

  const [value, setValue] = useState(payload.design?.design.includes);

  const { t } = useTranslation();
  const { handleBlockChange } = useDesignUtilities({ payload, setPayload });
  const colors = useColorScheme();

  useDebounce(() => handleBlockChange('includes', value || ''), 500, [value]);

  return (
    <Card
      title={t('includes')}
      className="shadow-sm"
      childrenClassName="pt-6"
      padding="small"
      height="full"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <Editor
        defaultLanguage="twig"
        language="twig"
        value={payload.design?.design.includes}
        theme={colors.name === 'invoiceninja.dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={(markup) => setValue(markup)}
      />
    </Card>
  );
}
