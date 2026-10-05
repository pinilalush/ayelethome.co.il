import type { APIRoute } from 'astro';

const SITEMAP = 'sitemap-index.xml';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${SITEMAP}`, site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
