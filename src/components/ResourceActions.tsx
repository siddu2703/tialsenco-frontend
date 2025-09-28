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
import { Dropdown } from './dropdown/Dropdown';
import { Button } from './forms';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '$app/common/colors';

export type Action<T = unknown> = (resource: T) => ReactNode;

interface Props {
  resource: unknown;
  label?: string | null;
  actions: Action<any>[];
  onSaveClick?: () => void;
  disableSaveButton?: boolean;
  disableSaveButtonOnly?: boolean;
  cypressRef?: string;
  saveButtonLabel?: string | null;
}

export function ResourceActions(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const {
    onSaveClick,
    disableSaveButton,
    label,
    saveButtonLabel,
    disableSaveButtonOnly,
  } = props;

  return (
    <>
      {onSaveClick && (
        <div className="flex">
          <Button
            behavior="button"
            className="rounded-br-none rounded-tr-none px-3"
            onClick={onSaveClick}
            disabled={disableSaveButton || disableSaveButtonOnly}
            disableWithoutIcon
          >
            {saveButtonLabel ?? t('save')}
          </Button>

          <Dropdown
            className="rounded-bl-none rounded-tl-none h-full border-l-1 border-y-0 border-r-0"
            cardActions
            disabled={disableSaveButton}
            cypressRef={props.cypressRef}
            labelButtonBorderColor={colors.$1}
          >
            {props.actions.map((action, index) => (
              <Fragment key={index}>{action(props.resource)}</Fragment>
            ))}
          </Dropdown>
        </div>
      )}

      {!onSaveClick && label && (
        <Dropdown label={props.label} cypressRef={props.cypressRef}>
          {props.actions.map((action, index) => (
            <Fragment key={index}>{action(props.resource)}</Fragment>
          ))}
        </Dropdown>
      )}
    </>
  );
}
