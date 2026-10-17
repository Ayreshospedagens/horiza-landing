import { describe, it, expect } from 'vitest';
import { lerUtms, comUtms, utmsDaSessao } from './utm';

describe('lerUtms', () => {
  it('lê só as chaves utm_ preenchidas', () => {
    expect(lerUtms('?utm_source=instagram&utm_medium=&x=1&utm_campaign=carrossel')).toEqual({ utm_source: 'instagram', utm_campaign: 'carrossel' });
  });
  it('sem query devolve vazio', () => {
    expect(lerUtms('')).toEqual({});
  });
});

describe('comUtms', () => {
  it('acrescenta UTMs a um link do app', () => {
    expect(comUtms('https://app.usehoriza.com.br/auth?modo=cadastro', { utm_source: 'meta' }))
      .toBe('https://app.usehoriza.com.br/auth?modo=cadastro&utm_source=meta');
  });
  it('não sobrescreve UTM que o link já tem', () => {
    expect(comUtms('https://app.usehoriza.com.br/auth?utm_source=landing', { utm_source: 'meta', utm_campaign: 'x' }))
      .toBe('https://app.usehoriza.com.br/auth?utm_source=landing&utm_campaign=x');
  });
  it('não mexe em âncoras e mailto', () => {
    expect(comUtms('#demonstracao', { utm_source: 'meta' })).toBe('#demonstracao');
    expect(comUtms('mailto:contato@usehoriza.com.br', { utm_source: 'meta' })).toBe('mailto:contato@usehoriza.com.br');
  });
  it('sem UTMs devolve o link igual', () => {
    expect(comUtms('https://app.usehoriza.com.br/', {})).toBe('https://app.usehoriza.com.br/');
  });
});

describe('utmsDaSessao', () => {
  function memoria() {
    const m = new Map<string, string>();
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
  }
  it('guarda as UTMs da URL e devolve depois', () => {
    const s = memoria();
    expect(utmsDaSessao('?utm_source=meta', s)).toEqual({ utm_source: 'meta' });
    expect(utmsDaSessao('', s)).toEqual({ utm_source: 'meta' });
  });
  it('storage quebrado não derruba a página', () => {
    const quebrado = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('bloqueado'); } };
    expect(utmsDaSessao('?utm_source=meta', quebrado)).toEqual({ utm_source: 'meta' });
  });
});
