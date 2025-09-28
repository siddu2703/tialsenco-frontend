/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Tooltip } from '$app/components/Tooltip';
import { Link } from '$app/components/forms';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import reactStringReplace from 'react-string-replace';

interface Props {
  size?: number;
}
export function UserUnsubscribedTooltip(props?: Props) {
  const [t] = useTranslation();

  const { size = 22 } = props || {};

  return (
    <Tooltip
      tooltipElement={reactStringReplace(
        t('user_unsubscribed') as string,
        ':link',
        () => (
          <Link
            className="lowercase text-xs"
            to="https://tilsenco.github.io/en/hosted-mail/"
            external
          >
            {t('link')}.
          </Link>
        )
      )}
      width="auto"
      placement="top"
    >
      <MdWarning color="red" size={size} />
    </Tooltip>
  );
}
