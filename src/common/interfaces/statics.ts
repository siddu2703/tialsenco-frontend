/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Country } from './country';
import { Currency } from './currency';
import { DateFormat } from './date-format';

export interface Statics {
  banks: Bank[];
  countries: Country[];
  currencies: Currency[];
  date_formats: DateFormat[];
  datetime_formats: DateFormat[];
  gateways: Gateway[];
  industries: Industry[];
  languages: Language[];
  payment_types: PaymentType[];
  sizes: Industry[];
  timezones: Timezone[];
  templates: Templates;
  bulk_updates: Record<string, string[]>;
  license_key?: string;
}

export interface Bank {
  id: string;
  name: string;
  remote_id: string;
  bank_library_id: number;
  config: string;
}

export interface Gateway {
  id: string;
  name: string;
  key: string;
  provider: string;
  visible: boolean;
  sort_order: number;
  site_url?: string;
  is_offsite: boolean;
  is_secure: boolean;
  fields: string;
  default_gateway_type_id: string;
  created_at: number;
  updated_at: number;
  options: Record<string | number, Option>;
}

export interface Option {
  refund: boolean;
  token_billing: boolean;
  webhooks?: string[];
}

export interface Industry {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
  locale: string;
}

export interface PaymentType {
  id: string;
  name: string;
  gateway_type_id: number | null;
}

export interface Templates {
  invoice: TemplateBody;
  quote: TemplateBody;
  payment: TemplateBody;
  payment_partial: TemplateBody;
  reminder1: TemplateBody;
  reminder2: TemplateBody;
  reminder3: TemplateBody;
  reminder_endless: TemplateBody;
  statement: TemplateBody;
  credit: TemplateBody;
}

export interface TemplateBody {
  subject: string;
  body: string;
}

export interface Timezone {
  id: string;
  name: string;
  location: string;
  utc_offset: number;
}
