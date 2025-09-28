/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { Element } from '../../../../components/cards';
import { useDispatch, useSelector } from 'react-redux';
import { updateChanges } from '$app/common/stores/slices/user';
import { RootState } from '../../../../common/stores/store';
import colors from '$app/common/constants/colors';
import { ColorPicker } from '$app/components/forms/ColorPicker';

export function AccentColor() {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const userChanges = useSelector((state: RootState) => state.user.changes);

  return (
    <Element leftSide={t('accent_color')}>
      <ColorPicker
        value={
          userChanges?.company_user?.settings?.accent_color || colors.primary
        }
        onValueChange={(color) =>
          dispatch(
            updateChanges({
              property: 'company_user.settings.accent_color',
              value: color,
            })
          )
        }
      />
    </Element>
  );
}
