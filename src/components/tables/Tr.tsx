/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import CommonProps from '../../common/interfaces/common-props.interface';
import { useColorScheme } from '$app/common/colors';
import { memo } from 'react';
import { isEqual } from 'lodash';

interface Props extends CommonProps {
  isLoading?: boolean;
  onClick?: () => unknown;
  backgroundColor?: string;
  resource?: unknown;
  withoutBackgroundColor?: boolean;
  memoValue?: unknown;
}

export function Tr(props: Props) {
  const {
    onClick,
    innerRef,
    backgroundColor,
    resource,
    withoutBackgroundColor = false,
    memoValue,
    ...otherProps
  } = props;
  const colors = useColorScheme();

  return (
    <tr
      style={{
        backgroundColor: withoutBackgroundColor
          ? undefined
          : backgroundColor || colors.$1,
        ...props.style,
      }}
      onClick={(event) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        props.onClick && event.target?.nodeName === 'TD'
          ? props.onClick()
          : null
      }
      ref={innerRef}
      {...otherProps}
      className={classNames(`${props.className}`, {
        'cursor-pointer': onClick,
      })}
      tabIndex={props.tabIndex}
    >
      {props.children}
    </tr>
  );
}

export const MemoizedTr = memo(
  Tr,
  (prev, next) =>
    isEqual(prev.resource, next.resource) &&
    isEqual(prev.memoValue, next.memoValue)
);
