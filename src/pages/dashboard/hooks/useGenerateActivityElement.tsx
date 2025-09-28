/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { date, endpoint, trans } from '$app/common/helpers';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import {
  ActivityRecord,
  ActivityRecordBase,
} from '$app/common/interfaces/activity-record';
import { route } from '$app/common/helpers/route';
import reactStringReplace from 'react-string-replace';
import { Button, InputField, Link } from '$app/components/forms';
import { useColorScheme } from '$app/common/colors';
import { Modal } from '$app/components/Modal';
import { useTranslation } from 'react-i18next';
import { ReactNode, useState } from 'react';
import { toast } from '$app/common/helpers/toast/toast';
import { request } from '$app/common/helpers/request';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useCompanyTimeFormat } from '$app/common/hooks/useCompanyTimeFormat';
import dayjs from 'dayjs';
import { ArrowRight } from '$app/components/icons/ArrowRight';
import styled from 'styled-components';
import { SquareActivityChart } from '$app/components/icons/SquareActivityChart';

const Box = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};

  &:hover {
    background-color: ${(props) => props.theme.hoverBackgroundColor};
  }
`;

export function useGenerateActivityElement() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const { timeFormat } = useCompanyTimeFormat();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const generate = (activity: ActivityRecord) => {
    let text = trans(`activity_${activity.activity_type_id}`, {});

    if (activity.activity_type_id === 10 && activity.contact) {
      text = trans(`activity_10_online`, {});
    }

    if (activity.activity_type_id === 54 && activity.contact) {
      text = text.replace(':user', ':contact');
    }

    const entities = [
      'invoice',
      'quote',
      'recurring_invoice',
      'vendor',
      'credit',
      'payment',
      'project',
      'task',
      'expense',
      'recurring_expense',
      'bank_transaction',
      'purchase_order',
    ];

    const getCurrentEntity = () => {
      const activityEntity = Object.keys(activity || {}).find((key) =>
        entities.includes(key)
      );

      if (!activityEntity && activity?.client) {
        return 'client';
      }

      if (activityEntity) {
        return activityEntity;
      }

      return '';
    };

    const activityEntity = getCurrentEntity();

    const replacements = {
      client: (
        <Link to={route('/clients/:id', { id: activity.client?.hashed_id })}>
          {activity.client?.label}
        </Link>
      ),
      contact: (
        <Link
          to={route(`/${activity?.contact?.contact_entity}/:id`, {
            id: activity.contact?.hashed_id,
          })}
        >
          {activity.contact?.label}
        </Link>
      ),
      quote: (
        <Link to={route('/quotes/:id/edit', { id: activity.quote?.hashed_id })}>
          {activity.quote?.label}
        </Link>
      ),
      user: activity.user?.label ?? t('system'),
      expense: (
        <Link
          to={route('/expenses/:id/edit', { id: activity.expense?.hashed_id })}
        >
          {activity?.expense?.label}
        </Link>
      ),
      recurring_invoice: (
        <Link
          to={route('/recurring_invoices/:id/edit', {
            id: activity.recurring_invoice?.hashed_id,
          })}
        >
          {activity?.recurring_invoice?.label}
        </Link>
      ),
      recurring_expense: (
        <Link
          to={route('/recurring_expenses/:id/edit', {
            id: activity.recurring_expense?.hashed_id,
          })}
        >
          {activity?.recurring_expense?.label}
        </Link>
      ),
      purchase_order: (
        <Link
          to={route('/purchase_orders/:id/edit', {
            id: activity.purchase_order?.hashed_id,
          })}
        >
          {activity?.purchase_order?.label}
        </Link>
      ),
      invoice: (
        <Link
          to={route('/invoices/:id/edit', { id: activity.invoice?.hashed_id })}
        >
          {activity?.invoice?.label}
        </Link>
      ),
      payment_amount: activity?.payment_amount?.label,
      payment: (
        <Link
          to={route('/payments/:id/edit', { id: activity.payment?.hashed_id })}
        >
          {activity?.payment?.label}
        </Link>
      ),
      credit: (
        <Link
          to={route('/credits/:id/edit', { id: activity.credit?.hashed_id })}
        >
          {activity?.credit?.label}
        </Link>
      ),
      task: (
        <Link to={route('/tasks/:id/edit', { id: activity.task?.hashed_id })}>
          {activity?.task?.label}
        </Link>
      ),
      vendor: (
        <Link
          to={route('/vendors/:id/edit', { id: activity.vendor?.hashed_id })}
        >
          {activity?.vendor?.label}
        </Link>
      ),
      subscription: (
        <Link
          to={route('/settings/subscriptions/:id/edit', {
            id: activity.subscription?.hashed_id,
          })}
        >
          {activity?.subscription?.label}
        </Link>
      ),
      adjustment: activity?.adjustment?.label,
      notes:
        activity?.notes &&
        [151, 152, 153].includes(activity.activity_type_id) ? (
          <>{activity?.notes ?? ''}</>
        ) : activityEntity &&
          activity[activityEntity as keyof typeof activity] ? (
          <>
            <br />

            <Link
              to={route(
                `/${activityEntity}s/${
                  (
                    activity[
                      activityEntity as keyof typeof activity
                    ] as ActivityRecordBase
                  ).hashed_id
                }/edit`
              )}
            >
              {activity?.notes}
            </Link>
          </>
        ) : null,
    };

    for (const [variable, value] of Object.entries(replacements)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      text = reactStringReplace(text, `:${variable}`, () => value);
    }

    return text;
  };

  const getDateTimeLabel = (dateTimestamp: number) => {
    const now = dayjs();
    const timestamp = dayjs.unix(dateTimestamp);

    const diffDays = now.diff(timestamp, 'day');
    const diffMinutes = now.diff(timestamp, 'minute');

    if (diffMinutes <= 1) {
      return t('just_now');
    } else if (diffDays === 1) {
      return t('yesterday');
    } else {
      return date(
        dateTimestamp,
        `${dateFormat} ${timeFormat.replace(':ss', '')}`
      );
    }
  };

  return (activity: ActivityRecord) => (
    <Box
      key={activity.id}
      className="flex space-x-3 p-4 rounded-md flex-1 min-w-0 w-full"
      theme={{
        backgroundColor: colors.$1,
        hoverBackgroundColor: colors.$25,
      }}
    >
      <div className="flex items-center justify-center">
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: colors.$20 }}
        >
          <SquareActivityChart
            size="1.3rem"
            color={colors.$16}
            filledColor={colors.$16}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
        <div className="text-sm" style={{ color: colors.$3 }}>
          {generate(activity)}
        </div>

        <div
          className="flex w-full items-center space-x-1 text-xs truncate"
          style={{ color: colors.$17 }}
        >
          <span className="whitespace-nowrap">
            {getDateTimeLabel(activity.created_at)}
          </span>

          <span>-</span>

          <span>{activity.ip}</span>
        </div>
      </div>
    </Box>
  );
}

interface Props {
  entity:
    | 'client'
    | 'invoice'
    | 'recurring_invoice'
    | 'quote'
    | 'credit'
    | 'vendor'
    | 'purchase_order';
  entityId: string | undefined;
  label: string;
  labelElement?: ReactNode;
}

export function AddActivityComment(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const { entity, entityId, label, labelElement } = props;

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [notes, setNotes] = useState<string>('');

  const handleOnClose = () => {
    setIsModalOpen(false);
    setNotes('');
  };

  const handleAddComment = () => {
    if (!isFormBusy) {
      setIsFormBusy(true);

      toast.processing();

      request('POST', endpoint('/api/v1/activities/notes'), {
        entity: `${entity}s`,
        entity_id: entityId,
        notes,
      })
        .then(() => {
          toast.success('saved_comment');
          $refetch(['activities']);
        })
        .finally(() => {
          setIsFormBusy(false);
          handleOnClose();
        });
    }
  };

  return (
    <>
      {entityId && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          {labelElement || (
            <Button behavior="button" type="secondary" onClick={() => {}}>
              {t('add_comment')}
            </Button>
          )}
        </div>
      )}

      <Modal
        size="regular"
        title={
          <div className="flex items-center space-x-2">
            <span>{t('comment')}</span>

            <div>
              <ArrowRight color={colors.$17} />
            </div>

            <span>
              {t(entity)} {label}
            </span>
          </div>
        }
        visible={isModalOpen}
        onClose={handleOnClose}
      >
        <InputField
          element="textarea"
          value={notes}
          onValueChange={(value) => setNotes(value)}
          changeOverride
        />

        <div className="flex self-end">
          <Button
            behavior="button"
            onClick={handleAddComment}
            disabled={isFormBusy || !notes}
            disableWithoutIcon
          >
            {t('add')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
