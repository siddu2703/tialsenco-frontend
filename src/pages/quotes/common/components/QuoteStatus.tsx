/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Quote } from '$app/common/interfaces/quote';
import { Badge } from '$app/components/Badge';
import { useTranslation } from 'react-i18next';
import { QuoteStatus as QuoteStatusEnum } from '$app/common/enums/quote-status';
import { useStatusThemeColorScheme } from '$app/pages/settings/user/components/StatusColorTheme';

interface Props {
  entity: Quote;
}

export function QuoteStatus(props: Props) {
  const [t] = useTranslation();

  const { status_id, is_deleted, archived_at, invoice_id, invitations } =
    props.entity;

  const statusThemeColors = useStatusThemeColorScheme();

  const checkQuoteInvitationsViewedDate = () => {
    return invitations?.some((invitation) => invitation.viewed_date);
  };

  const isApproved =
    status_id === QuoteStatusEnum.Approved ||
    status_id === QuoteStatusEnum.Converted;
  const isUnpaid = !isApproved;
  const isViewed = checkQuoteInvitationsViewedDate();

  const statusExpired = status_id === QuoteStatusEnum.Expired;

  if (is_deleted) return <Badge variant="red">{t('deleted')}</Badge>;

  if (archived_at) return <Badge variant="orange">{t('archived')}</Badge>;

  if (invoice_id) {
    return (
      <Badge variant="green" style={{ backgroundColor: statusThemeColors.$3 }}>
        {t('converted')}
      </Badge>
    );
  }

  if (statusExpired) {
    return (
      <Badge variant="red" style={{ backgroundColor: statusThemeColors.$5 }}>
        {t('expired')}
      </Badge>
    );
  }

  if (isViewed && isUnpaid && !isApproved) {
    return <Badge variant="yellow">{t('viewed')}</Badge>;
  }

  if (status_id === QuoteStatusEnum.Draft) {
    return <Badge variant="generic">{t('draft')}</Badge>;
  }

  if (status_id === QuoteStatusEnum.Sent) {
    return (
      <Badge
        variant="light-blue"
        style={{ backgroundColor: statusThemeColors.$1 }}
      >
        {t('sent')}
      </Badge>
    );
  }

  if (status_id === QuoteStatusEnum.Approved) {
    return (
      <Badge
        variant="dark-blue"
        style={{ backgroundColor: statusThemeColors.$2 }}
      >
        {t('approved')}
      </Badge>
    );
  }

  return <></>;
}
