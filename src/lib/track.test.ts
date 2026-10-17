import { describe, it, expect, vi } from 'vitest';
import { rastrear, EVENTO_META } from './track';

describe('rastrear', () => {
  it('envia sempre para a Vercel', () => {
    const vercel = vi.fn();
    rastrear('cta_teste_click', { local: 'hero' }, { vercel });
    expect(vercel).toHaveBeenCalledWith('cta_teste_click', { local: 'hero' });
  });
  it('envia para Meta e Google quando existem', () => {
    const fbq = vi.fn();
    const gtag = vi.fn();
    rastrear('cta_teste_click', { local: 'hero' }, { vercel: vi.fn(), fbq, gtag });
    expect(gtag).toHaveBeenCalledWith('event', 'cta_teste_click', { local: 'hero' });
    expect(fbq).toHaveBeenCalledWith('track', 'StartTrial', { local: 'hero' });
    expect(fbq).toHaveBeenCalledWith('track', 'Lead', { local: 'hero', origem: 'cta_teste_click' });
  });
  it('erro de um serviço não impede os outros nem derruba a página', () => {
    const vercel = vi.fn(() => { throw new Error('offline'); });
    const gtag = vi.fn(() => { throw new Error('bloqueado'); });
    const fbq = vi.fn();
    expect(() => rastrear('cta_whatsapp_click', {}, { vercel, fbq, gtag })).not.toThrow();
    expect(fbq).toHaveBeenCalledWith('track', 'Contact', {});
  });
  it('mapeamento dos eventos do Meta', () => {
    expect(EVENTO_META).toEqual({ cta_teste_click: 'StartTrial', cta_whatsapp_click: 'Contact', video_play: 'ViewContent' });
  });
  it('vídeo não dispara Lead', () => {
    const fbq = vi.fn();
    rastrear('video_play', {}, { vercel: vi.fn(), fbq });
    expect(fbq).not.toHaveBeenCalledWith('track', 'Lead', expect.anything());
  });
});
