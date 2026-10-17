export type Evento = 'cta_teste_click' | 'cta_whatsapp_click' | 'video_play';

export const EVENTO_META: Record<Evento, string> = {
  cta_teste_click: 'StartTrial',
  cta_whatsapp_click: 'Contact',
  video_play: 'ViewContent',
};

// Cliques de interesse (testar ou chamar no WhatsApp) também viram "Lead":
// é o evento único que os anúncios otimizam, para a Meta buscar quem quer testar OU conversar.
const GERA_LEAD: Evento[] = ['cta_teste_click', 'cta_whatsapp_click'];

export function rastrear(
  evento: Evento,
  dados: Record<string, string>,
  deps: {
    vercel: (nome: string, dados?: Record<string, string>) => void;
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  },
): void {
  try { deps.vercel(evento, dados); } catch { /* medição nunca derruba a página */ }
  try { deps.gtag?.('event', evento, dados); } catch { /* idem */ }
  try { deps.fbq?.('track', EVENTO_META[evento], dados); } catch { /* idem */ }
  if (GERA_LEAD.includes(evento)) {
    try { deps.fbq?.('track', 'Lead', { ...dados, origem: evento }); } catch { /* idem */ }
  }
}
