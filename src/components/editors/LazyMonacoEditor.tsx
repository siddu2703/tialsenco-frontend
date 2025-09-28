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

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface Props {
  height?: string;
  defaultLanguage?: string;
  value?: string;
  options?: any;
  onChange?: (value?: string) => void;
}

export function LazyMonacoEditor(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      }
    >
      <MonacoEditor {...props} />
    </Suspense>
  );
}
