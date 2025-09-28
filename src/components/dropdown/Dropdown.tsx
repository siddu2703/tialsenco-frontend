/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import Tippy from '@tippyjs/react/headless';
import CommonProps from '../../common/interfaces/common-props.interface';
import { ChevronDown } from 'react-feather';
import {
  Children,
  cloneElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DropdownElement } from './DropdownElement';
import { useClickAway } from 'react-use';
import classNames from 'classnames';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { styled } from 'styled-components';
import { useColorScheme } from '$app/common/colors';

interface Props extends CommonProps {
  label?: string | null;
  cardActions?: boolean;
  cypressRef?: string;
  customLabel?: ReactNode;
  minWidth?: string;
  maxWidth?: string;
  labelButtonBorderColor?: string;
}

const LabelButton = styled.button`
  color: ${(props) => props.theme.color} !important;
  background-color: ${(props) => props.theme.backgroundColor} !important;
  border-color: ${(props) => props.theme.borderColor} !important;
`;

const DropdownElements = styled.div`
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

export function Dropdown(props: Props) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const [children, setChildren] = useState<ReactNode>();

  const getPropsWithChildType = (
    childType: string | typeof DropdownElement,
    index: number
  ) => {
    if (childType === 'div') {
      return {
        onClick: () => setVisible(false),
        key: index,
      };
    } else {
      return { setVisible, key: index };
    }
  };

  useClickAway(ref, () => {
    visible && setVisible(false);
  });

  useEffect(() => {
    setChildren(Children.toArray(props.children));
  }, [props.children]);

  return (
    <div ref={ref}>
      <Tippy
        disabled={props.disabled}
        placement="bottom"
        interactive={true}
        render={() => (
          <DropdownElements
            theme={{ hoverColor: colors.$2 }}
            className={`border box rounded-md shadow-lg focus:outline-none whitespace-normal ${props.className}`}
            style={{
              backgroundColor: colors.$1,
              borderColor: colors.$19,
              minWidth: props.minWidth ?? '12rem',
              maxWidth: props.maxWidth ?? '14.7rem',
            }}
            data-cy={props.cypressRef}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {children?.map((child, index: number) =>
              child &&
              (child['type'] == DropdownElement || child['type'] == 'div')
                ? cloneElement(
                    child,
                    getPropsWithChildType(child['type'], index)
                  )
                : child
            )}
          </DropdownElements>
        )}
        visible={visible}
      >
        {props.customLabel ? (
          <div
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setVisible(!visible);
            }}
          >
            {props.customLabel}
          </div>
        ) : (
          <LabelButton
            theme={{
              backgroundColor: colors.$18,
              color: colors.$1,
              borderColor: props.labelButtonBorderColor || colors.$24,
            }}
            type="button"
            disabled={props.disabled}
            onClick={() => setVisible(!visible)}
            className={classNames(
              `border inline-flex items-center space-x-2 px-4 justify-center rounded-md text-sm disabled:cursor-not-allowed disabled:opacity-75 py-2 ${props.className}`,
              {
                'hover:bg-white hover:border-gray-300': !props.cardActions,
                'hover:opacity-90': props.cardActions,
              }
            )}
            style={{
              backgroundColor: props.cardActions && accentColor,
              color: props.cardActions ? 'white' : '',
            }}
            data-cy="chevronDownButton"
          >
            {!props.cardActions && <span>{props.label}</span>}
            <ChevronDown size={props.cardActions ? 18 : 14} />
          </LabelButton>
        )}
      </Tippy>
    </div>
  );
}
