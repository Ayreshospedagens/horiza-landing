export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CHAVE = 'hz-utms';

export function lerUtms(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function comUtms(href: string, utms: Record<string, string>): string {
  if (!/^https?:\/\//i.test(href) || Object.keys(utms).length === 0) return href;
  const url = new URL(href);
  for (const [k, v] of Object.entries(utms)) {
    if (!url.searchParams.has(k)) url.searchParams.append(k, v);
  }
  return url.toString();
}

export function utmsDaSessao(search: string, storage: Pick<Storage, 'getItem' | 'setItem'>): Record<string, string> {
  const daUrl = lerUtms(search);
  try {
    if (Object.keys(daUrl).length) {
      storage.setItem(CHAVE, JSON.stringify(daUrl));
      return daUrl;
    }
    const salvo = storage.getItem(CHAVE);
    return salvo ? (JSON.parse(salvo) as Record<string, string>) : {};
  } catch {
    return daUrl;
  }
}
