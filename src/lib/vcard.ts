export type VCard = {
  name: string;
  organization: string;
  title: string;
  phone: string;
  whatsapp: string;
  email?: string;
  url: string;
};

const escapeText = (value: string) => value.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');

function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  let size = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    if (size + bytes > (parts.length === 0 ? 75 : 74)) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += char;
    size += bytes;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function buildVCard(card: VCard): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${escapeText(card.name)};;;`,
    `FN:${escapeText(card.name)}`,
    `ORG:${escapeText(card.organization)}`,
    `TITLE:${escapeText(card.title)}`,
    `TEL;TYPE=CELL,VOICE:${card.phone}`,
    ...(card.whatsapp === card.phone ? [] : [`item1.TEL;TYPE=CELL:${card.whatsapp}`, 'item1.X-ABLabel:WhatsApp']),
    ...(card.email ? [`EMAIL;TYPE=INTERNET:${card.email}`] : []),
    `URL:${card.url}`,
    'END:VCARD',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
