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
import classNames from 'classnames';
import { ReactNode } from 'react';
import { CSSProperties } from 'styled-components';

interface Props {
  style?: CSSProperties;
  leftSide?: ReactNode;
  leftSideHelp?: ReactNode;
  pushContentToRight?: boolean;
  required?: boolean;
  children?: ReactNode;
  className?: any;
  onClick?: () => unknown;
  noExternalPadding?: boolean;
  withoutItemsCenter?: boolean;
  withoutWrappingLeftSide?: boolean;
  disabledLabels?: boolean;
  noVerticalPadding?: boolean;
  twoGridColumns?: boolean;
  textVerticalAlign?: 'top' | 'middle' | 'bottom';
}

export function Element(props: Props) {
  const colors = useColorScheme();

  const { style } = props;

  return (
    <div
      className={classNames(
        `sm:grid sm:gap-10 flex flex-col lg:flex-row ${props.className}`,
        {
          'px-5 sm:px-6': !props.noExternalPadding,
          'py-4 sm:py-3': !props.noVerticalPadding,
          'sm:items-center': !props.withoutItemsCenter,
          'sm:grid-cols-2': props.twoGridColumns,
          'sm:grid-cols-3': !props.twoGridColumns,
        }
      )}
      onClick={props.onClick}
      style={{ color: colors.$3, colorScheme: colors.$0, ...style }}
    >
      <dt
        className={classNames('text-sm flex flex-col', {
          'opacity-75': props.disabledLabels,
          'h-full justify-start': props.textVerticalAlign === 'top',
        })}
        style={{ color: colors.$3, colorScheme: colors.$0 }}
      >
        <span
          className={classNames('font-medium', {
            'whitespace-nowrap': props.withoutWrappingLeftSide,
          })}
          style={{ color: colors.$22, colorScheme: colors.$0 }}
        >
          {props.leftSide}
          {props.required && <span className="ml-1 text-red-600">*</span>}
        </span>
        {props.leftSideHelp &&
          (typeof props.leftSideHelp === 'object' ? (
            props.leftSideHelp
          ) : (
            <span
              className="text-xs"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: props.leftSideHelp }}
              style={{
                color: colors.$22,
                colorScheme: colors.$0,
                opacity: 0.8,
              }}
            ></span>
          ))}
      </dt>
      <dd
        className={classNames('mt-4 text-sm sm:mt-0', {
          'flex flex-col sm:flex-row sm:justify-end': props.pushContentToRight,
          'sm:col-span-1': props.twoGridColumns,
          'sm:col-span-2': !props.twoGridColumns,
        })}
        style={{ color: colors.$3, colorScheme: colors.$0 }}
      >
        {props.children}
      </dd>
    </div>
  );
}
