import type { Config, FONTS } from './schema.ts';

const FONT_STACKS: Record<(typeof FONTS)[number], string> = {
  rubik: "'Rubik Variable', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
};

export function themeCss(theme: Config['theme']): string {
  const { colors } = theme;
  const vars = {
    '--color-ink': colors.ink,
    '--color-surface': colors.surface,
    '--color-surface-alt': colors.surfaceAlt,
    '--color-text': colors.text,
    '--color-text-muted': colors.textMuted,
    '--color-primary': colors.primary,
    '--color-primary-text': colors.primaryText,
    '--color-accent': colors.accent,
    '--radius': theme.radius,
    '--font-sans': FONT_STACKS[theme.font],
  };
  return `:root{${Object.entries(vars).map(([name, value]) => `${name}:${value}`).join(';')}}`;
}
