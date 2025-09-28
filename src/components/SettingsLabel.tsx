/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import { ReactNode } from 'react';

interface Props {
  label: string | ReactNode;
  helpLabel?: string | ReactNode | null;
  required?: boolean;
}

export function SettingsLabel(props: Props) {
  const { label, helpLabel, required } = props;

  const colors = useColorScheme();

  return (
    <div className="flex flex-col text-sm">
      <span className="font-medium" style={{ color: colors.$22 }}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>

      {helpLabel && (
        <>
          {typeof helpLabel === 'string' ? (
            <span
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: helpLabel }}
              style={{ color: colors.$22, opacity: 0.8 }}
            />
          ) : (
            <div
              className="text-xs"
              style={{ color: colors.$22, opacity: 0.8 }}
            >
              {helpLabel}
            </div>
          )}
        </>
      )}
    </div>
  );
}
