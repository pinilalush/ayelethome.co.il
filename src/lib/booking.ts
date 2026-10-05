import { fill } from './text.ts';

export type Slot = 'day' | 'evening';
export type DayCode = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';

export const DAY_CODES: DayCode[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export type BookingTexts = {
  slots: { day: { inMessage: string }; evening?: { inMessage: string } };
  message: string;
  price: { single: string; split?: string };
  availability: { open: string; dated: string };
  when: { date: string; time: string };
};

export type DurationForms = {
  half: string;
  one: string;
  oneAndHalf: string;
  two: string;
  twoAndHalf: string;
  other: string;
};

export type PricingInfo = {
  currency: string;
  hourlyRate: number;
  minimumHours: number;
  step: number;
  evening?: { from: string; hourlyRate: number };
};

export type WorkRange = { days: DayCode[]; from: string; to: string };

export type Choice = {
  serviceName: string;
  slot: Slot;
  hours: number;
  day?: { weekday: DayCode; date: string };
  start?: number;
};

export type Breakdown = { dayHours: number; eveningHours: number; total: number };

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatMoney(lang: string, amount: number, currency: string): string {
  return new Intl.NumberFormat(lang, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatMoneyParts(lang: string, amount: number, currency: string): Intl.NumberFormatPart[] {
  return new Intl.NumberFormat(lang, { style: 'currency', currency, maximumFractionDigits: 0 }).formatToParts(amount);
}

export function formatNumber(lang: string, value: number): string {
  return new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(value);
}

export function formatDuration(lang: string, hours: number, forms: DurationForms): string {
  if (hours === 0.5) return forms.half;
  if (hours === 1) return forms.one;
  if (hours === 1.5) return forms.oneAndHalf;
  if (hours === 2) return forms.two;
  if (hours === 2.5) return forms.twoAndHalf;
  return fill(forms.other, { n: formatNumber(lang, hours) });
}

export function breakdown(pricing: PricingInfo, slot: Slot, hours: number, start?: number): Breakdown {
  const evening = pricing.evening;
  let eveningHours = 0;
  if (evening) {
    if (start === undefined) {
      eveningHours = slot === 'evening' ? hours : 0;
    } else {
      const eveningStart = toMinutes(evening.from);
      const end = start + hours * 60;
      eveningHours = Math.max(0, end - Math.max(start, eveningStart)) / 60;
    }
  }
  const dayHours = hours - eveningHours;
  const total = dayHours * pricing.hourlyRate + eveningHours * (evening?.hourlyRate ?? 0);
  return { dayHours, eveningHours, total };
}

function tidy(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,?!:;])/g, '$1')
    .trim();
}

export function buildMessage(input: {
  lang: string;
  texts: BookingTexts;
  durations: DurationForms;
  days: Record<DayCode, string>;
  pricing: PricingInfo;
  choice: Choice;
}): string {
  const { lang, texts, durations, days, pricing, choice } = input;
  const evening = pricing.evening;
  const { dayHours, eveningHours, total } = breakdown(pricing, choice.slot, choice.hours, choice.start);
  const money = (amount: number) => formatMoney(lang, amount, pricing.currency);

  const price =
    evening && texts.price.split && dayHours > 0 && eveningHours > 0
      ? fill(texts.price.split, {
          dayDuration: formatDuration(lang, dayHours, durations),
          eveningDuration: formatDuration(lang, eveningHours, durations),
          rate: money(pricing.hourlyRate),
          eveningRate: money(evening.hourlyRate),
          total: money(total),
        })
      : fill(texts.price.single, {
          rate: money(evening && eveningHours > 0 ? evening.hourlyRate : pricing.hourlyRate),
          total: money(total),
        });

  const when: string[] = [];
  if (choice.day) when.push(fill(texts.when.date, { weekday: days[choice.day.weekday], date: choice.day.date }));
  if (choice.start !== undefined) when.push(fill(texts.when.time, { time: formatTime(choice.start) }));
  const availability = when.length ? fill(texts.availability.dated, { when: when.join(' ') }) : texts.availability.open;

  const slot = evening ? (texts.slots[choice.slot]?.inMessage ?? '') : '';

  return tidy(
    fill(texts.message, {
      service: choice.serviceName,
      duration: formatDuration(lang, choice.hours, durations),
      slot,
      availability,
      price,
    }),
  );
}

export function rangesFor(workHours: WorkRange[], weekday: DayCode): Array<{ from: number; to: number }> {
  return workHours.filter((r) => r.days.includes(weekday)).map((r) => ({ from: toMinutes(r.from), to: toMinutes(r.to) }));
}

export function startTimes(input: {
  workHours: WorkRange[];
  weekday: DayCode;
  slot: Slot;
  hours: number;
  eveningFrom?: string;
  earliest?: number;
}): number[] {
  const { workHours, weekday, slot, hours, eveningFrom, earliest = 0 } = input;
  const eveningStart = eveningFrom === undefined ? undefined : toMinutes(eveningFrom);
  const length = hours * 60;
  const starts: number[] = [];
  for (const { from, to } of rangesFor(workHours, weekday)) {
    for (let start = from; start + length <= to; start += 30) {
      if (start < earliest) continue;
      if (eveningStart !== undefined && slot === 'day' && start >= eveningStart) continue;
      if (eveningStart !== undefined && slot === 'evening' && start < eveningStart) continue;
      starts.push(start);
    }
  }
  return [...new Set(starts)].sort((a, b) => a - b);
}

export function maxHours(workHours: WorkRange[], pricing: PricingInfo, cap = 12): number {
  const longest = Math.max(0, ...workHours.map((r) => (toMinutes(r.to) - toMinutes(r.from)) / 60));
  const limit = Math.min(cap, longest);
  const steps = Math.floor((limit - pricing.minimumHours) / pricing.step + 1e-9);
  return Math.max(pricing.minimumHours, pricing.minimumHours + steps * pricing.step);
}

export type LocaleTexts = {
  booking: BookingTexts;
  durations: DurationForms;
  days: Record<DayCode, string>;
  services: Record<string, string>;
};

export type BookingConfig = {
  visitor: string;
  contact: string;
  whatsapp: string;
  pricing: PricingInfo;
  workHours: WorkRange[];
  maxHours: number;
  defaultService: string;
  texts: Record<string, LocaleTexts>;
};
