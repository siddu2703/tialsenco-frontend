/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Spinner } from '$app/components/Spinner';
import { Default } from '$app/components/layouts/Default';
import { Suspense } from 'react';

interface Props {
  children: JSX.Element;
  type?: 'page' | 'component' | 'subPage';
}

export function Fallback({ children, type = 'page' }: Props) {
  return (
    <Suspense
      fallback={
        type === 'page' || type === 'component' ? (
          <Default breadcrumbs={[]}>
            <Spinner />
          </Default>
        ) : (
          <Spinner />
        )
      }
    >
      {children}
    </Suspense>
  );
}
