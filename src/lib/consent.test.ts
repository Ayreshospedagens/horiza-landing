import { describe, it, expect, vi } from 'vitest';
import { lerConsentimento, salvarConsentimento, deveCarregarPixel, carregarPixel, deveCarregarGa, carregarGa } from './consent';

function memoria() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe('consentimento', () => {
  it('começa sem resposta', () => {
    expect(lerConsentimento(memoria())).toBeNull();
  });
  it('guarda e lê a escolha', () => {
    const s = memoria();
    salvarConsentimento(s, 'recusado');
    expect(lerConsentimento(s)).toBe('recusado');
  });
  it('valor estranho no storage vale como sem resposta', () => {
    const s = memoria();
    s.setItem('hz-consentimento', 'talvez');
    expect(lerConsentimento(s)).toBeNull();
  });
  it('storage bloqueado vale como sem resposta', () => {
    expect(lerConsentimento({ getItem: () => { throw new Error('x'); } })).toBeNull();
  });
});

describe('deveCarregarPixel', () => {
  it('só com aceite e com ID configurado', () => {
    expect(deveCarregarPixel('aceito', '123')).toBe(true);
    expect(deveCarregarPixel('recusado', '123')).toBe(false);
    expect(deveCarregarPixel(null, '123')).toBe(false);
    expect(deveCarregarPixel('aceito', null)).toBe(false);
  });
});

describe('carregarPixel', () => {
  it('insere o script uma única vez e inicia o fbq', () => {
    const inseridos: { src: string }[] = [];
    const doc = {
      createElement: () => ({ src: '', async: false }),
      head: { appendChild: (el: { src: string }) => inseridos.push(el) },
    } as unknown as Document;
    const win = {} as Window & { fbq?: ((...a: unknown[]) => void) & { queue?: unknown[][] } };
    carregarPixel('123', win, doc);
    carregarPixel('123', win, doc);
    expect(inseridos).toHaveLength(1);
    expect(inseridos[0].src).toBe('https://connect.facebook.net/en_US/fbevents.js');
    expect(win.fbq?.queue).toEqual([['init', '123'], ['track', 'PageView']]);
  });

  it('segue o trecho oficial da Meta: expõe _fbq e repassa ao callMethod quando o script carrega', () => {
    const doc = { createElement: () => ({ src: '', async: false }), head: { appendChild: () => {} } } as unknown as Document;
    type F = ((...a: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...a: unknown[]) => void };
    const win = {} as Window & { fbq?: F; _fbq?: F };
    carregarPixel('123', win, doc);
    expect(win._fbq).toBe(win.fbq); // sem isso o fbevents.js acusa "multiple pixels" e não envia
    const recebidos: unknown[][] = [];
    win.fbq!.callMethod = (...a: unknown[]) => { recebidos.push(a); }; // o que o fbevents.js faz ao carregar
    win.fbq!('track', 'Lead');
    expect(recebidos).toEqual([['track', 'Lead']]);
  });
  it('GA só com aceite e id', () => {
    expect(deveCarregarGa('aceito', 'G-123')).toBe(true);
    expect(deveCarregarGa('recusado', 'G-123')).toBe(false);
    expect(deveCarregarGa(null, 'G-123')).toBe(false);
    expect(deveCarregarGa('aceito', null)).toBe(false);
  });
  it('carregarGa injeta o script do Google uma vez', () => {
    const appendChild = vi.fn();
    const doc = { createElement: () => ({}) as HTMLScriptElement, head: { appendChild } } as unknown as Document;
    const win = {} as Window & { gtag?: unknown; dataLayer?: unknown[] };
    carregarGa('G-123', win, doc);
    carregarGa('G-123', win, doc);
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(win.dataLayer!.length).toBeGreaterThan(0);
  });
  it('storage que lança erro não derruba', () => {
    const ruim = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    expect(lerConsentimento(ruim)).toBeNull();
    expect(() => salvarConsentimento(ruim, 'aceito')).not.toThrow();
  });
});
