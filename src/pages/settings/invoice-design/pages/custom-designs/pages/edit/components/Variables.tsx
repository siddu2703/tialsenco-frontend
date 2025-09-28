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
import { TabGroup } from '$app/components/TabGroup';
import { Card } from '$app/components/cards';
import { variables } from '$app/pages/settings/invoice-design/customize/common/variables';
import { Variable } from '$app/pages/settings/templates-and-reminders/common/components/Variable';
import { useTranslation } from 'react-i18next';

export default function Variables() {
  const { t } = useTranslation();

  const colors = useColorScheme();

  return (
    <Card
      title={t('variables')}
      className="shadow-sm"
      padding="small"
      childrenClassName="px-5 pt-6"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <TabGroup tabs={[t('invoice'), t('client'), t('contact'), t('company')]}>
        <section>
          {variables.invoice.map((variable, index) => (
            <Variable key={index}>{variable}</Variable>
          ))}
        </section>

        <section>
          {variables.client.map((variable, index) => (
            <Variable key={index}>{variable}</Variable>
          ))}
        </section>

        <section>
          {variables.contact.map((variable, index) => (
            <Variable key={index}>{variable}</Variable>
          ))}
        </section>

        <section>
          {variables.company.map((variable, index) => (
            <Variable key={index}>{variable}</Variable>
          ))}
        </section>
      </TabGroup>
    </Card>
  );
}
