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
import { Link } from 'react-router-dom';
import CommonProps from '../../common/interfaces/common-props.interface';
import { useColorScheme } from '$app/common/colors';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';
import { usePreventNavigation } from '$app/common/hooks/usePreventNavigation';
import { preventLeavingPageAtom } from '$app/common/hooks/useAddPreventNavigationEvents';
import { ReactElement } from 'react';

interface Props extends CommonProps {
  to?: string;
  setVisible?: (value: boolean) => any;
  icon?: ReactElement;
  cypressRef?: string;
  actionKey?: 'switchCompany';
  disablePreventNavigation?: boolean;
}

const Button = styled.button`
  color: ${(props) => props.theme.color};
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color};
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
`;

export function DropdownElement(props: Props) {
  const colors = useColorScheme();

  const { prevent: preventLeavingPage } = useAtomValue(preventLeavingPageAtom);

  const preventNavigation = usePreventNavigation({
    disablePrevention: props.disablePreventNavigation,
  });

  const { actionKey } = props;

  if (props.to) {
    return (
      <div className="p-1">
        <StyledLink
          theme={{
            color: colors.$3,
            hoverColor: colors.$20,
          }}
          to={props.to}
          className={classNames(
            {
              'flex items-center': props.icon,
            },
            `w-full text-left z-50 block px-4 py-2 text-sm text-gray-700 rounded-[0.1875rem] ${props.className}`
          )}
          onClick={(event) => {
            if (preventLeavingPage) {
              event.preventDefault();

              preventNavigation({ url: props.to });
            }
          }}
        >
          {props.icon && <div>{props.icon}</div>}

          <div
            className={classNames({
              'ml-2': props.icon,
            })}
          >
            {props.children}
          </div>
        </StyledLink>
      </div>
    );
  }

  return (
    <div className="p-1">
      <Button
        theme={{
          color: colors.$3,
          hoverColor: colors.$20,
        }}
        type="button"
        onClick={(event) =>
          preventNavigation({
            fn: () => {
              props.onClick?.(event);
              props.setVisible?.(false);
            },
            actionKey,
          })
        }
        ref={props.innerRef}
        className={classNames(
          {
            'flex items-center': props.icon,
          },
          `w-full text-left z-50 block px-4 py-2 text-sm rounded-[0.1875rem] ${props.className} `
        )}
        data-cy={props.cypressRef}
      >
        {props.icon && <div>{props.icon}</div>}

        <div
          className={classNames({
            'ml-2': props.icon,
          })}
        >
          {props.children}
        </div>
      </Button>
    </div>
  );
}
