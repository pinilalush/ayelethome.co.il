import type { IconName } from './icons.ts';
import type { PAYMENTS } from './schema.ts';

export const PAYMENT_ICONS: Record<(typeof PAYMENTS)[number], IconName> = {
  bit: 'mobilepay',
  paybox: 'mobilepay',
  cash: 'cash',
  transfer: 'bank',
  credit: 'card',
};
