/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { Payment as PaymentEntity } from '$app/common/interfaces/payment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { usePaymentQuery } from '$app/common/queries/payments';
import { Page } from '$app/components/Breadcrumbs';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { ResourceActions } from '$app/components/ResourceActions';
import { Tabs } from '$app/components/Tabs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useActions } from './common/hooks/useActions';
import { useSave } from './edit/hooks/useSave';
import { useTabs } from './edit/hooks/useTabs';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import {
  ChangeTemplateModal,
  useChangeTemplate,
} from '../settings/invoice-design/pages/custom-designs/components/ChangeTemplate';
import { Banner } from '$app/components/Banner';
import {
  socketId,
  useSocketEvent,
  WithSocketId,
} from '$app/common/queries/sockets';
import { PreviousNextNavigation } from '$app/components/PreviousNextNavigation';
import { InputLabel } from '$app/components/forms';

export default function Payment() {
  const [t] = useTranslation();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { id } = useParams();

  const { data } = usePaymentQuery({ id, include: 'credits' });

  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [paymentValue, setPaymentValue] = useState<PaymentEntity>();

  const pages: Page[] = [
    { name: t('payments'), href: '/payments' },
    {
      name: t('edit_payment'),
      href: route('/payments/:id/edit', { id: id }),
    },
  ];

  const tabs = useTabs({ payment: paymentValue });

  const onSave = useSave({ setErrors, isFormBusy, setIsFormBusy });

  const actions = useActions();

  useEffect(() => {
    if (data) {
      setPaymentValue(data);
    }
  }, [data]);

  const {
    changeTemplateVisible,
    setChangeTemplateVisible,
    changeTemplateResources,
  } = useChangeTemplate();

  useSocketEvent<WithSocketId<PaymentEntity>>({
    on: ['App\\Events\\Payment\\PaymentWasUpdated'],
    callback: ({ data }) => {
      if (socketId()?.toString() !== data['x-socket-id']) {
        document
          .getElementById('paymentUpdateBanner')
          ?.classList.remove('hidden');
      }
    },
  });

  return (
    <Default
      title={t('payment')}
      breadcrumbs={pages}
      {...((hasPermission('edit_payment') || entityAssigned(paymentValue)) &&
        paymentValue && {
          onSaveClick: () => onSave(paymentValue as unknown as PaymentEntity),
          navigationTopRight: (
            <ResourceActions
              label={t('more_actions')}
              resource={paymentValue}
              actions={actions}
              cypressRef="paymentActionDropdown"
            />
          ),
          disableSaveButton: !paymentValue || isFormBusy,
        })}
      aboveMainContainer={
        <Banner id="paymentUpdateBanner" className="hidden" variant="orange">
          {t('payment_status_changed')}
        </Banner>
      }
      afterBreadcrumbs={<PreviousNextNavigation entity="payment" />}
    >
      <Container breadcrumbs={[]}>
        <Tabs tabs={tabs} disableBackupNavigation />

        <Outlet
          context={{
            errors,
            payment: paymentValue,
            setPayment: setPaymentValue,
          }}
        />
      </Container>

      <ChangeTemplateModal<PaymentEntity>
        entity="payment"
        entities={changeTemplateResources as PaymentEntity[]}
        visible={changeTemplateVisible}
        setVisible={setChangeTemplateVisible}
        labelFn={(payment) => (
          <div className="flex flex-col space-y-1">
            <InputLabel>{t('number')}</InputLabel>

            <span>{payment.number}</span>
          </div>
        )}
        bulkUrl="/api/v1/payments/bulk"
      />
    </Default>
  );
}
