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

export function ActionCard(props: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 bg-white w-full p-8 rounded shadow my-4">
      <div className={`flex justify-between items-center`}>
        <section>
          <h2 className="text-gray-800">{props.label}</h2>
          {props.help && (
            <span className="text-xs text-gray-600">{props.help}</span>
          )}
        </section>
        {props.children}
      </div>
    </div>
  );
}
