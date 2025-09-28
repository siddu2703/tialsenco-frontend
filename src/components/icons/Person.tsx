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
  color?: string;
  size?: string;
  fill?: string;
}

export function Person({
  color = '#A1A1AA',
  size = '1rem',
  fill = '#A1A1AA',
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      style={{ width: size, height: size }}
      viewBox="0 0 20 20"
    >
      <circle
        cx="10"
        cy="5.5"
        r="2.5"
        fill={fill}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></circle>
      <path
        d="m14.664,16.455c.947-.221,1.469-1.303.991-2.15-1.114-1.973-3.227-3.305-5.655-3.305s-4.541,1.332-5.655,3.305c-.478.847.044,1.929.991,2.15,3.11.727,6.219.727,9.329,0Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        fill={fill}
      ></path>
    </svg>
  );
}
