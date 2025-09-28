/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Tooltip } from './Tooltip';
import { useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';
import { Icon as ReactFeatherIcon } from 'react-feather';
import { Icon } from './icons/Icon';
import { DropdownElement } from './dropdown/DropdownElement';
import CommonProps from '$app/common/interfaces/common-props.interface';
import { Entity } from './CommonActionsPreferenceModal';
import { useShowActionByPreferences } from '$app/common/hooks/useShowActionByPreferences';
import { usePreventNavigation } from '$app/common/hooks/usePreventNavigation';
import { useColorScheme } from '$app/common/colors';

interface Props extends CommonProps {
  onClick?: () => void;
  to?: string;
  icon: IconType | ReactFeatherIcon;
  tooltipText?: string | null;
  setVisible?: (value: boolean) => void;
  isCommonActionSection: boolean;
  entity: Entity;
  actionKey: string;
  excludePreferences?: boolean;
  disablePreventNavigation?: boolean;
}

export function EntityActionElement(props: Props) {
  const colors = useColorScheme();

  const navigate = useNavigate();
  const preventNavigation = usePreventNavigation({
    disablePrevention: props.disablePreventNavigation,
  });

  const {
    isCommonActionSection,
    onClick,
    to,
    icon,
    tooltipText,
    entity,
    actionKey,
    excludePreferences,
    setVisible,
  } = props;

  const showActionByPreferences = useShowActionByPreferences({
    commonActionsSection: isCommonActionSection,
    entity,
  });

  if (!showActionByPreferences(actionKey) && !excludePreferences) {
    return <></>;
  }

  if (isCommonActionSection) {
    return (
      <Tooltip
        width="auto"
        placement="bottom"
        message={tooltipText as string}
        withoutArrow
      >
        <div
          onClick={() =>
            preventNavigation({
              fn: () => (to ? navigate(to) : onClick?.()),
            })
          }
        >
          <Icon element={icon} size={23.5} color={colors.$3} />
        </div>
      </Tooltip>
    );
  }

  return (
    <DropdownElement
      to={to}
      icon={<Icon element={props.icon} />}
      onClick={onClick}
      setVisible={setVisible}
      disablePreventNavigation={props.disablePreventNavigation}
    >
      {props.children}
    </DropdownElement>
  );
}
