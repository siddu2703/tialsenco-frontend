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
import CommonProps from '../../common/interfaces/common-props.interface';

interface Props extends CommonProps {
  backgroundColor?: string;
}

export function Thead(props: Props) {
  const { backgroundColor } = props;

  const colors = useColorScheme();

  return (
    <thead
      className="border-b"
      style={{
        backgroundColor: backgroundColor || colors.$1,
        borderColor: colors.$20,
        ...props.style,
      }}
    >
      <tr>{props.children}</tr>
    </thead>
  );
}
