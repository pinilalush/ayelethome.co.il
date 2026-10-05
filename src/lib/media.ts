import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/media/*.{svg,png,jpg,jpeg,webp,avif}', { eager: true });

export function findImage(file: string | undefined): ImageMetadata | undefined {
  if (!file) return undefined;
  return Object.entries(images).find(([path]) => path.endsWith(`/${file}`))?.[1].default;
}
