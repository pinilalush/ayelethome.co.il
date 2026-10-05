import { DAY_CODES, type DayCode } from './booking.ts';
import type { Business } from './schema.ts';

export type HoursLine = { days: string; from: string; to: string };

export function hoursLines(workHours: Business['workHours'], names: Record<DayCode, string>): HoursLine[] {
  return workHours.map(({ days, from, to }) => {
    const sorted = [...days].sort((a, b) => DAY_CODES.indexOf(a) - DAY_CODES.indexOf(b));
    const runs: DayCode[][] = [];
    for (const day of sorted) {
      const run = runs.at(-1);
      if (run && DAY_CODES.indexOf(day) === DAY_CODES.indexOf(run[run.length - 1]) + 1) run.push(day);
      else runs.push([day]);
    }
    const text = runs
      .map((run) => (run.length > 2 ? `${names[run[0]]}–${names[run[run.length - 1]]}` : run.map((d) => names[d]).join(', ')))
      .join(', ');
    return { days: text, from, to };
  });
}
