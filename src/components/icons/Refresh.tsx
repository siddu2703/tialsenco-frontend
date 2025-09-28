/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React from 'react';

interface Props {
  size?: string;
  color?: string;
  className?: string;
}

export function Refresh({
  size = '1rem',
  color = '#A1A1AA',
  className,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      style={{ width: size, height: size }}
      viewBox="0 0 18 18"
      className={className}
    >
      <path
        d="M9,1c-2.48,0-4.765,1.155-6.261,3.042l-.116-.84c-.057-.411-.435-.7-.846-.64-.41,.057-.697,.435-.64,.846l.408,2.945c.052,.375,.373,.647,.742,.647,.034,0,.069-.002,.104-.007l2.944-.407c.411-.057,.697-.436,.641-.846-.057-.411-.438-.694-.846-.641l-1.458,.202c1.2-1.727,3.173-2.801,5.329-2.801,3.584,0,6.5,2.916,6.5,6.5,0,.414,.336,.75,.75,.75s.75-.336,.75-.75c0-4.411-3.589-8-8-8Z"
        fill={color}
      ></path>
      <path
        d="M15.609,11.007l-2.944,.407c-.411,.057-.697,.436-.641,.846,.057,.41,.435,.688,.846,.641l1.46-.202c-1.201,1.727-3.181,2.802-5.33,2.802-3.584,0-6.5-2.916-6.5-6.5,0-.414-.336-.75-.75-.75s-.75,.336-.75,.75c0,4.411,3.589,8,8,8,2.474,0,4.763-1.159,6.26-3.046l.117,.844c.052,.375,.373,.647,.742,.647,.034,0,.069-.002,.104-.007,.41-.057,.697-.435,.64-.846l-.408-2.945c-.057-.41-.438-.697-.845-.64Z"
        fill={color}
        data-color="color-2"
      ></path>
    </svg>
  );
}
