/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted, isSelfHosted } from '$app/common/helpers';
import dayjs from 'dayjs';
import { enterprisePlan } from '../guards/guards/enterprise-plan';
import { proPlan } from '../guards/guards/pro-plan';
import { useCurrentAccount } from './useCurrentAccount';

export function usePaidOrSelfHost() {
  const account = useCurrentAccount();

  const isPaidPlan =
    dayjs(account?.plan_expires).endOf('day').isAfter(dayjs()) &&
    (enterprisePlan() || proPlan());

  return (isHosted() && isPaidPlan) || isSelfHosted();
}

export function useIsPaid() {
  const account = useCurrentAccount();

  const isPaidPlan =
    dayjs(account?.plan_expires).endOf('day').isAfter(dayjs()) &&
    (enterprisePlan() || proPlan());

  return isPaidPlan;
}

export function useIsWhitelabelled() {
  const account = useCurrentAccount();

  return (
    account?.plan_expires !== '' &&
    !dayjs(account.plan_expires).isBefore(dayjs())
  );
}
