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
import { PanelResizeHandle as PanelResizeHandleBase } from 'react-resizable-panels';
import styled from 'styled-components';

const PanelResizeHandleBaseStyled = styled(PanelResizeHandleBase)`
  background-color: ${(props) => props.theme.backgroundColor};
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

interface Props {
  renderBasePanelResizeHandler: boolean;
}

export function PanelResizeHandle(props: Props) {
  const colors = useColorScheme();

  const { renderBasePanelResizeHandler } = props;

  return renderBasePanelResizeHandler ? (
    <PanelResizeHandleBaseStyled
      className="flex items-center"
      theme={{ hoverColor: '#3366CC', backgroundColor: colors.$21 }}
      style={{ width: '2.5px' }}
    />
  ) : (
    <></>
  );
}
