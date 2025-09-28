/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  numberOfDocuments: number | undefined;
  textCenter?: boolean;
}
export function DocumentsTabLabel(props: Props) {
  const [t] = useTranslation();

  const { numberOfDocuments, textCenter } = props;

  return (
    <div
      className={classNames('flex space-x-1', {
        'justify-center': textCenter,
      })}
    >
      <span>{t('documents')}</span>
      {Boolean(numberOfDocuments) && (
        <span className="font-bold">({numberOfDocuments})</span>
      )}
    </div>
  );
}
