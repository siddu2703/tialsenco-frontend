/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useReactSettings } from '$app/common/hooks/useReactSettings';

interface Params {
  entity: string;
}
export function useEntityImportTemplates(params: Params) {
  const reactSettings = useReactSettings();

  const { entity } = params;

  const numberOfTemplates = Object.keys(
    reactSettings?.import_templates?.[entity] || {}
  ).length;

  const templates = Object.keys(
    reactSettings?.import_templates?.[entity] || {}
  );

  return { numberOfTemplates, templates };
}
