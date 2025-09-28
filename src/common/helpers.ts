/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { route } from '$app/common/helpers/route';
import entityState from './constants/entity-state';
import { request } from './helpers/request';
import { useCurrentCompanyDateFormats } from './hooks/useCurrentCompanyDateFormats';

export function isHosted(): boolean {
  return import.meta.env.VITE_IS_HOSTED === 'true';
}

export function isSelfHosted(): boolean {
  return !isHosted();
}

export function apiEndpoint(): string {
  return (
    import.meta.env.VITE_API_URL ||
    window.location.origin ||
    'http://localhost:8001'
  );
}

export function endpoint(endpoint: string, params = {}): string {
  return apiEndpoint() + route(endpoint, params);
}

export function fetcher(
  url: string,
  headers?: AxiosRequestHeaders,
  method: Method = 'GET'
): Promise<AxiosResponse> {
  return request(method, url, {}, { headers });
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export function date(date: number | string, format: string) {
  if (date === 0 || date === '' || date === undefined) {
    return '';
  }

  if (typeof date === 'number') {
    return dayjs.unix(date).format(format);
  }

  return dayjs(date).format(format);
}

export function useParseDayjs() {
  const { dateFormat } = useCurrentCompanyDateFormats();

  const unsupportedFormats = ['DD. MMM. YYYY', 'ddd MMM D, YYYY'];

  return (date: string | Date) => {
    return dayjs(
      date,
      !unsupportedFormats.includes(dateFormat) ? dateFormat : undefined
    );
  };
}

export function getEntityState(entity: any) {
  if (!entity.is_deleted && !entity.archived_at) {
    return entityState.active;
  }

  if (entity.archived_at && !entity.is_deleted) {
    return entityState.archived;
  }

  if (entity.is_deleted) {
    return entityState.deleted;
  }
}

export function trans(key: string, replace: Record<string, unknown>) {
  let translation = t(key);

  for (const placeholder in replace) {
    translation = translation.replace(
      `:${placeholder}`,
      replace[placeholder] as unknown as string
    );
  }

  return translation;
}

export function previewEndpoint(endpoint: string, params = {}): string {
  if (isHosted()) {
    return 'https://preview.invoicing.co' + route(endpoint, params);
  }

  return apiEndpoint() + route(endpoint, params);
}

export function isDemo() {
  const endpoint = import.meta.env.VITE_DEMO_ENDPOINT;

  return endpoint === apiEndpoint();
}

export function isProduction() {
  return import.meta.env.PROD;
}

export function checkJsonObject(text: string) {
  try {
    const parsedJson = text && JSON.parse(text);

    return parsedJson;
  } catch (e) {
    return false;
  }
}
