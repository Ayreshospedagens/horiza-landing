import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { site } from './site';

function textos(valor: unknown): string[] {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos);
  return [];
}
const todos = textos(site).join('\n');

describe('regras de conteúdo', () => {
  it('sem travessão', () => {
    expect(todos).not.toContain('—');
  });
  it('sem promessas, concorrentes e termos proibidos', () => {
    for (const p of [
      /open finance/i, /conecta(r)? (com|ao|a) (o )?(seu )?banco/i, /sincroniza/i, /fique rico/i, /enriquec/i,
      /liberdade financeira/i, /renda extra/i, /mobills|organizze|idinheiro|minhas economias|guiabolso/i,
      /gestor da temporada/i, /todos os bancos/i,
    ]) expect(todos).not.toMatch(p);
  });
  it('SMS sempre acompanhado de Itaú', () => {
    for (const t of textos(site).filter((t) => /\bSMS\b/.test(t))) expect(t).toMatch(/Itaú/);
  });
  it('preços iguais aos do app', () => {
    expect(site.planos.mensal.centavos).toBe(1490);
    expect(site.planos.anual.centavos).toBe(12990);
    expect(todos).toMatch(/7 dias grátis/);
    expect(todos).not.toMatch(/\b(14|15|30) dias\b/);
  });
  it('links certos', () => {
    expect(site.links.cadastro).toBe('https://app.usehoriza.com.br/auth?modo=cadastro');
    expect(site.links.whatsapp).toBe('https://wa.me/5521971585795');
    expect(site.whatsappMensagens.demo).toBe('Oi, Joel! Vi o site do Horiza e quero uma demonstração.');
    expect(site.links.email).toBe('contato@usehoriza.com.br');
  });
  it('depoimentos só com autorização', () => {
    for (const d of site.sobre.depoimentos) expect(d.autorizado).toBe(true);
  });
  it('perguntas frequentes cobrem banco, celular, cancelamento, SMS e pagamento', () => {
    const p = site.faq.itens.map((i) => i.pergunta).join(' ');
    for (const t of [/banco/i, /celular/i, /cancel/i, /SMS/, /pag/i]) expect(p).toMatch(t);
  });
  it('telas usam os prints da conta de demonstração', () => {
    expect(site.telas.itens.map((t) => t.arquivo)).toEqual(['fluxo', 'onde-cortar', 'metas', 'planejamento', 'dashboard']);
  });
});

describe('documentos legais', () => {
  const termos = readFileSync('src/content/termos.md', 'utf8');
  const priv = readFileSync('src/content/privacidade.md', 'utf8');
  it('são do Horiza, em nome do Joel, sem travessão', () => {
    for (const doc of [termos, priv]) {
      expect(doc).toContain('Joel Ayres');
      expect(doc).toContain('contato@usehoriza.com.br');
      expect(doc).not.toContain('—');
      expect(doc).not.toMatch(/gestor da temporada|imóve|hóspede|airbnb|cal\.com/i);
    }
  });
  it('privacidade cita os serviços usados e os direitos', () => {
    for (const t of [/Stripe/, /Supabase/, /Vercel/, /Anthropic/, /SMS/, /exclus/i, /cookies/i, /LGPD/, /13\.709/]) expect(priv).toMatch(t);
  });
  it('termos trazem preço, teste e cancelamento iguais ao site', () => {
    for (const t of [/R\$ 14,90/, /R\$ 129,90/, /7 dias/, /cancel/i, /sem cartão/i]) expect(termos).toMatch(t);
  });
});
