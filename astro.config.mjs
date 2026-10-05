// @ts-check
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
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
