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
import CommonProps from '$app/common/interfaces/common-props.interface';
import classNames from 'classnames';

interface Props extends CommonProps {
  withoutPadding?: boolean;
  borderColor?: string;
}

export function Divider(props: Props) {
  const colors = useColorScheme();

  return (
    <div
      style={{ borderColor: props.borderColor || colors.$21 }}
      className={classNames(
        'border-b',
        {
          'pt-6 mb-4 border-b': !props.withoutPadding,
        },
        props.className ?? ''
      )}
    ></div>
  );
}
