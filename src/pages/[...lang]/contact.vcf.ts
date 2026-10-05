import type { APIRoute } from 'astro';
import { getAbsoluteLocaleUrl } from 'astro:i18n';
import { getLocale, site } from '../../lib/data.ts';
import { buildVCard } from '../../lib/vcard.ts';

export function getStaticPaths() {
  return site.languages.map((l) => ({
    params: { lang: l.default ? undefined : l.code },
    props: { code: l.code },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const code: string = props.code;
  const { content } = getLocale(code);
  const { business } = site;
  const card = buildVCard({
    name: content.ownerName,
    organization: content.businessName,
    title: content.tagline,
    phone: business.phone,
    whatsapp: business.whatsapp,
    email: business.email,
    url: getAbsoluteLocaleUrl(code),
  });
  return new Response(card, { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } });
};
