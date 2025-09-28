/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AURegions } from './components/AURegions';
import { EURegions } from './components/EURegions';
import { UKRegions } from './components/UKRegions';
import { SellerSubregion } from './components/SellerSubregion';
import { USRegions } from './components/USRegions';

export function CalculateTaxes() {
  return (
    <>
      <SellerSubregion />
      <USRegions />
      <EURegions />
      <UKRegions />
      <AURegions />
    </>
  );
}
