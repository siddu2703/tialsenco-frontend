/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

interface Props {
  size?: string;
  color?: string;
}

export function TableColumns({ size = '1.2rem', color = '#000' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 12 12"
    >
      <line
        x1="6"
        y1="1.25"
        x2="6"
        y2="10.75"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        data-color="color-2"
      ></line>
      <rect
        x="1.25"
        y="1.25"
        width="9.5"
        height="9.5"
        rx="2"
        ry="2"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></rect>
    </svg>
  );
}
