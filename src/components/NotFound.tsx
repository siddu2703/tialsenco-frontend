/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import Logo from '../resources/images/tilsenco-logo@dark.png';

export default function NotFound() {
  const [t] = useTranslation();

  return (
    <div className="flex flex-col items-center h-screen py-16 px-5">
      <div className="flex flex-1 items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          {t('api_404')}
        </h1>
      </div>

      <img
        src={Logo}
        alt={t('company_logo') ?? 'Company logo'}
        className="w-52 md:w-64"
      />
    </div>
  );
}
