/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { Navigate, useParams } from 'react-router-dom';

export default function Show() {
  const { id } = useParams();

  return <Navigate to={route('/products/:id/edit', { id })} />;
}
