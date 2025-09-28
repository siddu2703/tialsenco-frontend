/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function Settings() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/settings/company_details');
  });

  return <></>;
}
