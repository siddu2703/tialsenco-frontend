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
import { RecurringExpenseCardProps } from './Details';
import { useColorScheme } from '$app/common/colors';

export function Notes(props: RecurringExpenseCardProps) {
  const [t] = useTranslation();

  const { recurringExpense, handleChange, errors } = props;

  const colors = useColorScheme();

  return (
    <Card
      title={t('notes')}
      isLoading={!recurringExpense}
      withContainer
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      {recurringExpense && (
        <InputField
          element="textarea"
          label={t('public_notes')}
          value={recurringExpense.public_notes}
          onValueChange={(value) => handleChange('public_notes', value)}
          errorMessage={errors?.errors.public_notes}
        />
      )}

      {recurringExpense && (
        <InputField
          element="textarea"
          label={t('private_notes')}
          value={recurringExpense.private_notes}
          onValueChange={(value) => handleChange('private_notes', value)}
          errorMessage={errors?.errors.private_notes}
        />
      )}
    </Card>
  );
}
