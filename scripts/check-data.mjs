import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ASSETS_MEDIA_DIR,
  DATA_DIR,
  PUBLIC_MEDIA_DIR,
  formatIssues,
  formatPending,
  validateSiteData,
} from '../src/lib/validate.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowPlaceholders = ['1', 'true'].includes(process.env.ALLOW_PLACEHOLDERS ?? '');

function readJsonTree(dir) {
  const files = {};
  const broken = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.json')) {
        const rel = path.relative(dir, full).split(path.sep).join('/');
        try {
          files[rel] = JSON.parse(fs.readFileSync(full, 'utf8'));
        } catch (error) {
          broken.push(`${DATA_DIR}/${rel}: not valid JSON (${error.message})`);
        }
      }
    }
  };
  walk(dir);
  return { files, broken };
}

function listFiles(dir) {
  const full = path.join(root, dir);
  return fs.existsSync(full) ? fs.readdirSync(full).filter((name) => fs.statSync(path.join(full, name)).isFile()) : [];
}

const { files, broken } = readJsonTree(path.join(root, DATA_DIR));
if (broken.length) {
  console.error(formatIssues(broken));
  process.exit(1);
}

const result = validateSiteData(files, {
  mediaFiles: listFiles(ASSETS_MEDIA_DIR),
  publicMediaFiles: listFiles(PUBLIC_MEDIA_DIR),
});

if (result.issues.length) {
  console.error(formatIssues(result.issues));
  if (result.pending.length) console.error(`\n${formatPending(result.pending)}`);
  process.exit(1);
}

if (result.pending.length && !allowPlaceholders) {
  console.error(formatPending(result.pending));
  console.error('\nReplace these with real data. To build a demo with test data anyway: ALLOW_PLACEHOLDERS=1 npm run build');
  process.exit(1);
}

if (result.pending.length) {
  console.warn(
    `Data check: building with test data (${result.pending.length} values), because ALLOW_PLACEHOLDERS is set.\n` +
      'The site shows a test-data banner and asks search engines not to index it.',
  );
} else {
  console.log('Data check passed: no problems and no test data left.');
}
