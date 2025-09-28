/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Badge } from '$app/components/Badge';
import { useTranslation } from 'react-i18next';
import { Payment } from '$app/common/interfaces/payment';
import { PaymentStatus as PaymentStatusEnum } from '$app/common/enums/payment-status';
import { useStatusThemeColorScheme } from '$app/pages/settings/user/components/StatusColorTheme';

interface Props {
  entity: Payment;
}

export function PaymentStatus(props: Props) {
  const [t] = useTranslation();

  const { status_id, applied, amount, is_deleted, archived_at } = props.entity;

  const statusThemeColors = useStatusThemeColorScheme();

  if (is_deleted) return <Badge variant="red">{t('deleted')}</Badge>;

  if (archived_at) return <Badge variant="orange">{t('archived')}</Badge>;

  if (applied < amount) {
    if (applied === 0) {
      return (
        <Badge
          variant="generic"
          style={{ backgroundColor: statusThemeColors.$1 }}
        >
          {t('unapplied')}
        </Badge>
      );
    } else {
      return <Badge variant="generic">{t('partially_unapplied')}</Badge>;
    }
  }

  if (status_id === PaymentStatusEnum.Pending) {
    return <Badge variant="generic">{t('payment_status_1')}</Badge>;
  }

  if (status_id === PaymentStatusEnum.Cancelled) {
    return (
      <Badge
        variant="light-blue"
        style={{ backgroundColor: statusThemeColors.$4 }}
      >
        {t('payment_status_2')}
      </Badge>
    );
  }

  if (status_id === PaymentStatusEnum.Failed) {
    return (
      <Badge variant="red" style={{ backgroundColor: statusThemeColors.$5 }}>
        {t('payment_status_3')}
      </Badge>
    );
  }

  if (status_id === PaymentStatusEnum.Completed) {
    return (
      <Badge variant="green" style={{ backgroundColor: statusThemeColors.$3 }}>
        {t('payment_status_4')}
      </Badge>
    );
  }

  if (status_id === PaymentStatusEnum.PartiallyRefunded) {
    return (
      <Badge
        variant="dark-blue"
        style={{ backgroundColor: statusThemeColors.$2 }}
      >
        {t('payment_status_5')}
      </Badge>
    );
  }

  if (status_id === PaymentStatusEnum.Refunded) {
    return <Badge variant="generic">{t('payment_status_6')}</Badge>;
  }

  return <></>;
}
