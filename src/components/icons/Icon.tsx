/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { isValidElement, cloneElement, createElement } from 'react';
import { IconType } from 'react-icons';
import { Icon as ReactFeatherIcon } from 'react-feather';
import CommonProps from '$app/common/interfaces/common-props.interface';
import { useColorScheme } from '$app/common/colors';

interface Props extends CommonProps {
  element: IconType | ReactFeatherIcon;
  size?: number;
  color?: string;
}

export function Icon(props: Props) {
  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const iconElement = createElement(props.element);

  if (isValidElement(iconElement)) {
    return cloneElement(iconElement, {
      fontSize: props.size || 20,
      color: props.color || accentColor,
      className: props.className,
      onClick: props.onClick,
      style: props.style,
    });
  }

  return <></>;
}
