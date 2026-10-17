export type Consentimento = 'aceito' | 'recusado' | null;
const CHAVE = 'hz-consentimento';
const SCRIPT = 'https://connect.facebook.net/en_US/fbevents.js';

export function lerConsentimento(storage: Pick<Storage, 'getItem'>): Consentimento {
  try {
    const v = storage.getItem(CHAVE);
    return v === 'aceito' || v === 'recusado' ? v : null;
  } catch {
    return null;
  }
}

export function salvarConsentimento(storage: Pick<Storage, 'setItem'>, valor: 'aceito' | 'recusado'): void {
  try { storage.setItem(CHAVE, valor); } catch { /* storage bloqueado: vale só nesta visita */ }
}

export function deveCarregarPixel(consentimento: Consentimento, pixelId: string | null): boolean {
  return consentimento === 'aceito' && Boolean(pixelId);
}

type Fbq = ((...args: unknown[]) => void) & {
  queue?: unknown[][]; loaded?: boolean; version?: string; push?: unknown; callMethod?: (...args: unknown[]) => void;
};

// Equivalente ao trecho oficial da Meta: o fbevents.js procura window._fbq e instala fbq.callMethod ao carregar
export function carregarPixel(pixelId: string, win: Window & { fbq?: unknown; _fbq?: unknown }, doc: Document): void {
  if (win.fbq) return;
  const fbq: Fbq = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.push = fbq;
  win.fbq = fbq;
  if (!win._fbq) win._fbq = fbq;
  const s = doc.createElement('script') as HTMLScriptElement;
  s.async = true;
  s.src = SCRIPT;
  doc.head.appendChild(s);
  fbq('init', pixelId);
  fbq('track', 'PageView');
}

export function deveCarregarGa(consentimento: Consentimento, gaId: string | null): boolean {
  return consentimento === 'aceito' && Boolean(gaId);
}

// Equivalente ao trecho oficial do Google Analytics 4 (gtag.js)
export function carregarGa(gaId: string, win: Window & { gtag?: unknown; dataLayer?: unknown[] }, doc: Document): void {
  if (win.gtag) return;
  win.dataLayer = win.dataLayer ?? [];
  // o gtag.js lê o objeto "arguments", por isso não é arrow function
  const gtag = function (..._args: unknown[]) { win.dataLayer!.push(arguments); };
  win.gtag = gtag;
  const s = doc.createElement('script') as HTMLScriptElement;
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  doc.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', gaId, { anonymize_ip: true });
}
