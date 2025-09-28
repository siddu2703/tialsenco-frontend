/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '$app/components/cards';
import { InputField } from '$app/components/forms';
import { useTranslation } from 'react-i18next';
import { ExpenseCardProps } from './Details';
import { useColorScheme } from '$app/common/colors';

export function Notes(props: ExpenseCardProps) {
  const [t] = useTranslation();
  const { expense, handleChange, errors } = props;

  const colors = useColorScheme();

  return (
    <Card
      title={t('notes')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
      isLoading={!expense}
      withContainer
    >
      {expense && (
        <InputField
          value={expense.public_notes}
          label={t('public_notes')}
          element="textarea"
          onValueChange={(value) => handleChange('public_notes', value)}
          errorMessage={errors?.errors.public_notes}
        />
      )}

      {expense && (
        <InputField
          value={expense.private_notes}
          label={t('private_notes')}
          element="textarea"
          onValueChange={(value) => handleChange('private_notes', value)}
          errorMessage={errors?.errors.private_notes}
        />
      )}
    </Card>
  );
}
