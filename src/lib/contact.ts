export function telHref(phone: string): string {
  return `tel:${phone}`;
}

export function whatsappHref(number: string, text?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
