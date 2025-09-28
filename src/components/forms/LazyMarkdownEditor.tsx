/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Suspense, lazy } from 'react';
import { Spinner } from '$app/components/Spinner';

const MarkdownEditor = lazy(() =>
  import('./MarkdownEditor').then((module) => ({
    default: module.MarkdownEditor,
  }))
);

interface Props {
  value?: string | undefined;
  onChange: (value: string) => unknown;
  label?: string;
  disabled?: boolean;
  handleChangeOnlyOnUserInput?: boolean;
}

export function LazyMarkdownEditor(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      }
    >
      <MarkdownEditor {...props} />
    </Suspense>
  );
}
