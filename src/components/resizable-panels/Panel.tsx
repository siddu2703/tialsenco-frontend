/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ReactNode } from 'react';
import { Panel as PanelBase } from 'react-resizable-panels';

interface Props {
  children: ReactNode;
  renderBasePanel: boolean;
}
export function Panel(props: Props) {
  const { children, renderBasePanel } = props;

  return renderBasePanel ? (
    <PanelBase defaultSize={50} minSize={25}>
      {children}
    </PanelBase>
  ) : (
    <>{children}</>
  );
}
