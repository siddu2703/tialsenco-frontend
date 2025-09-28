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
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { RecurringInvoiceStatus as RecurringInvoiceStatusEnum } from '$app/common/enums/recurring-invoice-status';
import { useStatusThemeColorScheme } from '$app/pages/settings/user/components/StatusColorTheme';

interface Props {
  entity: RecurringInvoice;
}

export function RecurringInvoiceStatus(props: Props) {
  const [t] = useTranslation();

  const statusThemeColors = useStatusThemeColorScheme();

  const {
    status_id,
    is_deleted,
    archived_at,
    last_sent_date,
    remaining_cycles,
  } = props.entity;

  const isDraft = status_id === RecurringInvoiceStatusEnum.DRAFT;
  const isDeleted = Boolean(is_deleted);
  const isArchived = Boolean(archived_at);
  const isPending =
    status_id === RecurringInvoiceStatusEnum.ACTIVE && !last_sent_date;
  const remainingCycles =
    remaining_cycles === -1 ? 'endless' : remaining_cycles;

  if (isDeleted) return <Badge variant="red">{t('deleted')}</Badge>;

  if (isArchived) return <Badge variant="orange">{t('archived')}</Badge>;

  if (!isDraft && remainingCycles === 0) {
    return (
      <Badge
        variant="light-blue"
        style={{ backgroundColor: statusThemeColors.$1 }}
      >
        {t('completed')}
      </Badge>
    );
  }

  if (isPending) {
    return (
      <Badge
        variant="dark-blue"
        style={{ backgroundColor: statusThemeColors.$2 }}
      >
        {t('pending')}
      </Badge>
    );
  }

  if (isDraft) {
    return <Badge variant="generic">{t('draft')}</Badge>;
  }

  if (status_id === RecurringInvoiceStatusEnum.ACTIVE) {
    return (
      <Badge variant="green" style={{ backgroundColor: statusThemeColors.$3 }}>
        {t('active')}
      </Badge>
    );
  }

  if (status_id === RecurringInvoiceStatusEnum.PAUSED) {
    return (
      <Badge variant="orange" style={{ backgroundColor: statusThemeColors.$4 }}>
        {t('paused')}
      </Badge>
    );
  }

  return <></>;
}
