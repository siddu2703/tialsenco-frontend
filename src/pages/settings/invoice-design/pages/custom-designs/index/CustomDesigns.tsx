/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { enterprisePlan } from '$app/common/guards/guards/enterprise-plan';
import { proPlan } from '$app/common/guards/guards/pro-plan';
import { AdvancedSettingsPlanAlert } from '$app/components/AdvancedSettingsPlanAlert';
import { DataTable } from '$app/components/DataTable';
import { EntityStatus } from '$app/components/EntityStatus';
import { Inline } from '$app/components/Inline';

export default function CustomDesigns() {
  return (
    <>
      <AdvancedSettingsPlanAlert />

      <DataTable
        endpoint="/api/v1/designs?custom=true"
        columns={[
          {
            id: 'name',
            label: 'Name',
            format: (field, resource) => (
              <Inline>
                <EntityStatus entity={resource} />
                <p>{field}</p>
              </Inline>
            ),
          },
        ]}
        resource="design"
        linkToCreate="/settings/invoice_design/custom_designs/create"
        bulkRoute="/api/v1/designs/bulk"
        linkToEdit="/settings/invoice_design/custom_designs/:id/edit"
        withResourcefulActions
        hideEditableOptions={!proPlan() && !enterprisePlan()}
        enableSavingFilterPreference
      />
    </>
  );
}
