export type Tone = 'surface' | 'alt';

export function alternate<K extends string>(shown: readonly K[]): Record<K, Tone> {
  return Object.fromEntries(shown.map((key, i) => [key, i % 2 === 0 ? 'surface' : 'alt'])) as Record<K, Tone>;
}
