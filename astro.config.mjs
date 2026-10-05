// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';
import business from './src/data/business.json' with { type: 'json' };
import config from './src/data/config.json' with { type: 'json' };

const locales = config.languages.map((l) => l.code);
const defaultLocale = config.languages.find((l) => l.default)?.code ?? locales[0];

export default defineConfig({
  site: business.siteUrl,
  base: business.basePath,
  trailingSlash: 'always',
  i18n: {
    locales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((code) => [code, code])),
      },
    }),
  ],
  env: {
    schema: {
      ALLOW_PLACEHOLDERS: envField.enum({
        context: 'server',
        access: 'public',
        values: ['0', '1', 'false', 'true'],
        default: '0',
      }),
    },
  },
});
