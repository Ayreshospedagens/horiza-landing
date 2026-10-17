import { track as vercelTrack } from '@vercel/analytics';
import { site } from '../content/site';
import { utmsDaSessao, comUtms } from './utm';
import { lerConsentimento, salvarConsentimento, deveCarregarPixel, carregarPixel, deveCarregarGa, carregarGa } from './consent';
import { rastrear, type Evento } from './track';

type Janela = Window & { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void; dataLayer?: unknown[]; __hzEventos?: { evento: string; dados: Record<string, string> }[] };
const w = window as Janela;
w.__hzEventos = [];

function evento(nome: Evento, dados: Record<string, string>) {
  w.__hzEventos!.push({ evento: nome, dados });
  rastrear(nome, dados, { vercel: vercelTrack, fbq: w.fbq, gtag: w.gtag });
}

// Storage pode estar bloqueado (aba anônima, cookies desligados): nunca derrubar a página
const semStorage = { getItem: () => null, setItem: () => {} };
function storage(tipo: 'local' | 'session') {
  try { return tipo === 'local' ? window.localStorage : window.sessionStorage; } catch { return semStorage; }
}
const local = storage('local');

// 1. UTMs: repassar para todo link marcado com data-utm
const utms = utmsDaSessao(location.search, storage('session'));
document.querySelectorAll<HTMLAnchorElement>('a[data-utm]').forEach((a) => {
  a.href = comUtms(a.href, utms);
});

// 2. Cliques rastreados
document.addEventListener('click', (e) => {
  const alvo = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (alvo) evento(alvo.dataset.track as Evento, { local: alvo.dataset.local ?? '' });
  if (alvo?.closest('.menu-mobile')) alvo.closest('details')?.removeAttribute('open');
});

// 3. Consentimento, Pixel da Meta e Google Analytics
const aviso = document.getElementById('aviso-cookies');
const ligarPixel = () => {
  const c = lerConsentimento(local);
  if (deveCarregarPixel(c, site.flags.metaPixelId)) carregarPixel(site.flags.metaPixelId!, w, document);
  if (deveCarregarGa(c, site.flags.gaId)) carregarGa(site.flags.gaId!, w, document);
};
if (lerConsentimento(local) === null) aviso?.removeAttribute('hidden');
ligarPixel();
aviso?.querySelectorAll<HTMLButtonElement>('[data-consentimento]').forEach((b) => {
  b.addEventListener('click', () => {
    const antes = lerConsentimento(local);
    const agora = b.dataset.consentimento as 'aceito' | 'recusado';
    salvarConsentimento(local, agora);
    aviso.setAttribute('hidden', '');
    // Pixel e GA já carregados não têm como ser desligados: recarregar a página o tira de cena
    if (antes === 'aceito' && agora === 'recusado') location.reload();
    else ligarPixel();
  });
});
// LGPD: o visitante pode rever a escolha a qualquer momento (link no rodapé)
document.querySelectorAll<HTMLButtonElement>('[data-preferencias-cookies]').forEach((b) => {
  b.addEventListener('click', () => aviso?.removeAttribute('hidden'));
});

// 5. Barra fixa no celular: aparece depois que o topo sai da tela
const barra = document.getElementById('barra-fixa');
const topo = document.getElementById('topo');
if (barra && topo) {
  new IntersectionObserver(([x]) => { barra.hidden = x.isIntersecting; }).observe(topo);
}

// 6. Vídeo: registrar o primeiro play (iframe do YouTube não expõe play sem API; usamos o foco na área)
document.getElementById('video-demo')?.addEventListener('pointerdown', () => evento('video_play', { local: 'demo' }), { once: true });
