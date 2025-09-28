/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import { sanitizeHTML } from '$app/common/helpers/html-string';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { Project } from '$app/common/interfaces/project';
import { InfoCard } from '$app/components/InfoCard';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  project: Project;
}

export function ProjectPrivateNotes(props: Props) {
  const [t] = useTranslation();

  const { project } = props;

  const colors = useColorScheme();
  const reactSettings = useReactSettings();

  return (
    <>
      {Boolean(project && project.private_notes) && (
        <InfoCard
          title={t('private_notes')}
          className="shadow-sm h-full 2xl:h-max col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-3 p-4"
          style={{ borderColor: colors.$24 }}
          withoutPadding
        >
          <div className="whitespace-normal pt-1 min-h-32 max-h-56 overflow-y-auto">
            <article
              className={classNames('prose prose-sm', {
                'prose-invert': reactSettings?.dark_mode,
              })}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(project.private_notes),
              }}
            />
          </div>
        </InfoCard>
      )}
    </>
  );
}
