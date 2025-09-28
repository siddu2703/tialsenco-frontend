/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { CSSProperties, ReactNode } from 'react';

export default interface CommonProps {
  id?: any;
  className?: string;
  children?: ReactNode;
  onChange?: any;
  value?: any;
  onClick?: any;
  innerRef?: any;
  disabled?: boolean;
  style?: CSSProperties;
  cypressRef?: string;
  tabIndex?: number;
}
