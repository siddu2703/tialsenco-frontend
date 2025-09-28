/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CommonProps from '$app/common/interfaces/common-props.interface';
import { MdClose } from 'react-icons/md';
import classNames from 'classnames';
import { Inline } from '../Inline';
import { useColorScheme } from '$app/common/colors';

interface Props extends CommonProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actionChildren?: ReactNode;
  size: 'extraSmall' | 'small' | 'regular' | 'large' | 'extraLarge';
  withContainer?: boolean;
  withoutActionContainer?: boolean;
  topRight?: ReactNode;
  withoutDivider?: boolean;
  withoutHeaderBorder?: boolean;
}

export function Slider(props: Props) {
  const colors = useColorScheme();

  const { withoutHeaderBorder } = props;

  return (
    <Transition.Root show={props.visible} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              className={classNames('pointer-events-auto', 'w-screen', {
                'max-w-xl': props.size === 'large',
                'max-w-sm': props.size === 'small',
                'max-w-md': props.size === 'regular',
                'max-w-xs': props.size === 'extraSmall',
                'max-w-4xl': props.size === 'extraLarge',
              })}
            >
              <form
                onSubmit={(event) => event.preventDefault()}
                className="border flex h-full flex-col shadow-xl"
                style={{ backgroundColor: colors.$1, borderColor: colors.$20 }}
              >
                <div className="flex flex-col flex-1 h-0 overflow-y-auto">
                  <div
                    className={classNames('py-4 px-4 sm:px-6', {
                      'border-b': !withoutHeaderBorder,
                    })}
                    style={{ borderColor: colors.$4 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="text-lg font-medium max-w-sm truncate"
                        style={{ color: colors.$3 }}
                      >
                        {props.title}
                      </span>

                      <Inline>
                        {props.topRight}

                        <MdClose
                          fontSize={20}
                          className="cursor-pointer"
                          onClick={() => props.onClose()}
                          color={colors.$3}
                        />
                      </Inline>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between items-center">
                    <div
                      className={classNames('flex flex-col flex-1 w-full', {
                        'p-4': props.withContainer,
                        'divide-y': !props.withoutDivider,
                      })}
                      style={{ borderColor: colors.$20 }}
                    >
                      {props.children}
                    </div>
                  </div>
                </div>

                {props.actionChildren && (
                  <div
                    className={classNames('flex justify-center border-t', {
                      'p-4': !props.withoutActionContainer,
                    })}
                    style={{ borderColor: colors.$20 }}
                  >
                    {props.actionChildren}
                  </div>
                )}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
