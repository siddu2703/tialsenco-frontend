/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import Turnstile from 'react-turnstile';

interface Props {
  onVerified: (token: string) => void;
}
export function TurnstileWidget(props: Props) {
  const { onVerified } = props;

  const siteKey = import.meta.env.VITE_CLOUDFLARE_SITE_ID;

  return (
    <Turnstile
      appearance="interaction-only"
      sitekey={siteKey}
      onVerify={(token) => onVerified(token)}
    />
  );
}
