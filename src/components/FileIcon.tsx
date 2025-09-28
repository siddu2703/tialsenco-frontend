/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { File, Jpg, Pdf, Png, Svg } from './icons';

interface Props {
  size?: number;
  type: string;
}
export function FileIcon(props: Props) {
  const supported = ['jpg', 'svg', 'png', 'pdf'];

  const { size = 26, type } = props;

  return (
    <>
      {type === 'jpg' && <Jpg height={size} />}
      {type === 'svg' && <Svg height={size} />}
      {type === 'png' && <Png height={size} />}
      {type === 'pdf' && <Pdf height={size} />}

      {!supported.includes(type) && <File height={size} />}
    </>
  );
}
