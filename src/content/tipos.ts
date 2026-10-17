export type Item = { titulo: string; texto: string };
export type Site = {
  flags: { videoDemoUrl: string | null; metaPixelId: string | null; gaId: string | null };
  links: { app: string; cadastro: string; whatsapp: string; instagram: string; email: string };
  whatsappMensagens: { geral: string; demo: string };
  seo: { titulo: string; descricao: string };
  hero: { titulo: string; apoio: string; selos: string[]; ctaTeste: string; ctaDemo: string };
  dores: { titulo: string; itens: Item[] };
  comoFunciona: { titulo: string; passos: Item[] };
  telas: { titulo: string; apoio: string; itens: { arquivo: string; aba: string; titulo: string; alt: string }[] };
  demo: { titulo: string; apoio: string; ctaWhatsapp: string };
  diferenciais: { titulo: string; itens: Item[] };
  sobre: { titulo: string; nome: string; paragrafos: string[]; depoimentos: { texto: string; autor: string; autorizado: boolean }[] };
  planos: {
    titulo: string;
    mensal: { nome: string; centavos: number; periodo: string; nota: string };
    anual: { nome: string; centavos: number; periodo: string; nota: string; selo: string };
    incluso: string[];
    rodape: string;
  };
  faq: { titulo: string; itens: { pergunta: string; resposta: string }[]; fecho: string };
  final: { titulo: string; apoio: string };
  cookies: { texto: string; aceitar: string; recusar: string };
};
