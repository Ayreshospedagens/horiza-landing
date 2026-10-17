import type { Site } from './tipos';
export type { Site } from './tipos';

export const site: Site = {
  flags: {
    videoDemoUrl: null, // quando gravar: 'https://www.youtube-nocookie.com/embed/<id>?rel=0'
    metaPixelId: null, // ligar quando começarem os anúncios na Meta
    gaId: null, // id do Google Analytics 4 (G-XXXX) quando a propriedade existir
  },
  links: {
    app: 'https://app.usehoriza.com.br/auth',
    // Botões de teste grátis: abre direto a aba Criar conta do app.
    cadastro: 'https://app.usehoriza.com.br/auth?modo=cadastro',
    whatsapp: 'https://wa.me/5521971585795',
    instagram: 'https://instagram.com/usehoriza',
    email: 'contato@usehoriza.com.br',
  },
  whatsappMensagens: {
    geral: 'Oi, Joel! Vi o site do Horiza e tenho uma dúvida.',
    demo: 'Oi, Joel! Vi o site do Horiza e quero uma demonstração.',
  },
  seo: {
    titulo: 'Horiza · Fluxo de caixa pessoal e orçamento familiar',
    descricao:
      'Veja quanto vai ter no banco nos próximos meses. Orçamento familiar com cartão no mês da fatura, contas a vencer, metas com data e lançamento pela Siri. 7 dias grátis, sem cartão.',
  },
  hero: {
    titulo: 'Veja o seu dinheiro lá na frente.',
    apoio:
      'O Horiza mostra quanto vai ter no banco nos próximos meses, com o cartão no mês da fatura, as contas a vencer e as metas com data.',
    selos: ['7 dias grátis', 'Sem cartão de crédito', 'Cancele quando quiser'],
    ctaTeste: 'Começar 7 dias grátis',
    ctaDemo: 'Ver como funciona',
  },
  dores: {
    titulo: 'Os outros apps contam onde você gastou. O Horiza mostra para onde você está indo.',
    itens: [
      { titulo: 'A fatura que assusta', texto: 'Você só descobre quanto gastou quando a fatura chega. No Horiza, cada compra no cartão já aparece no mês em que vai sair do banco.' },
      { titulo: 'O janeiro que sempre aperta', texto: 'IPVA, IPTU, matrícula e material escolar chegam todo ano. Planeje hoje e veja com meses de antecedência se o saldo fecha.' },
      { titulo: 'A meta que nunca tem data', texto: 'Reserva, viagem, troca do carro. O Horiza calcula pela sua sobra real em que mês cada uma fica pronta.' },
    ],
  },
  comoFunciona: {
    titulo: 'Como funciona',
    passos: [
      { titulo: 'Lance do seu jeito', texto: 'Digite, importe uma planilha do Excel, fale com a Siri ou deixe o SMS de compra lançar sozinho (para cartões Itaú).' },
      { titulo: 'Planeje o mês', texto: 'Defina quanto vai para casa, mercado, escola e lazer. O Horiza separa o essencial do que dá para cortar.' },
      { titulo: 'Enxergue os próximos meses', texto: 'O fluxo de caixa mostra o saldo previsto no banco no fim de cada mês e avisa antes de ficar no vermelho.' },
    ],
  },
  telas: {
    titulo: 'Tudo o que você precisa ver, numa tela só',
    apoio: 'Dados de exemplo de uma família fictícia.',
    itens: [
      { arquivo: 'fluxo', aba: 'Fluxo de caixa', titulo: 'Saldo previsto mês a mês, com janeiro e fevereiro no radar.', alt: 'Tela de fluxo de caixa do Horiza com o saldo previsto dos próximos meses' },
      { arquivo: 'onde-cortar', aba: 'Onde cortar', titulo: 'Simule um corte e veja quantos meses antes a meta fica pronta.', alt: 'Tela Onde cortar com cenário de redução de delivery e o efeito nas metas' },
      { arquivo: 'metas', aba: 'Metas', titulo: 'Cada meta com valor e mês previsto de conclusão.', alt: 'Tela de metas com reserva de emergência, viagem e troca do carro com datas previstas' },
      { arquivo: 'planejamento', aba: 'Planejamento', titulo: 'Orçamento por categoria, separado em essencial e não essencial.', alt: 'Tela de planejamento mensal por categoria' },
      { arquivo: 'dashboard', aba: 'Dashboard', titulo: 'Previsto x real e as maiores despesas do período.', alt: 'Dashboard com gráfico de previsto x real e ranking das maiores despesas' },
    ],
  },
  demo: {
    titulo: 'Quer ver o Horiza funcionando?',
    apoio: 'Chame no WhatsApp e eu te mostro, ao vivo, como fica com a sua rotina. Ou comece o teste e explore sozinho.',
    ctaWhatsapp: 'Pedir uma demonstração no WhatsApp',
  },
  diferenciais: {
    titulo: 'O que o Horiza faz diferente',
    itens: [
      { titulo: 'O cartão cai no mês certo', texto: 'Compra no cartão entra no mês em que a fatura vence, considerando o dia da virada. O saldo previsto não engana.' },
      { titulo: 'Lance falando', texto: '"E aí Siri, lançar no Horiza: paguei 120 de Pix na farmácia." Pronto, está lançado e classificado.' },
      { titulo: 'Corte com efeito nas metas', texto: 'Tire 40% do delivery e veja na hora a nova sobra e quantos meses antes cada meta fica pronta.' },
      { titulo: 'Projetos no planejamento', texto: 'Reforma, festa, viagem: monte o orçamento em parcelas e, ao aprovar, ele entra no seu planejamento.' },
    ],
  },
  sobre: {
    titulo: 'Quem fez o Horiza',
    nome: 'Joel Ayres',
    paragrafos: [
      'Criei o Horiza para organizar o dinheiro da minha família. Eu queria saber, hoje, se março ia fechar no azul, e nenhum app mostrava isso.',
      'Os colegas de trabalho viram, pediram para usar, e o Horiza virou o que é hoje: um planejamento que olha para a frente.',
    ],
    // Só frases reais, com autorização de cada testador.
    depoimentos: [],
  },
  planos: {
    titulo: 'Um plano, tudo incluso',
    mensal: { nome: 'Mensal', centavos: 1490, periodo: 'mês', nota: 'Cancele quando quiser.' },
    anual: { nome: 'Anual', centavos: 12990, periodo: 'ano', nota: 'Equivale a R$ 10,83 por mês.', selo: 'Economize 27%' },
    incluso: ['Todas as telas e relatórios', 'Lançar pela Siri e por SMS (cartões Itaú)', 'Sem limite de lançamentos', '7 dias grátis, sem cartão de crédito'],
    rodape: 'Pagamento com cartão, processado pelo Stripe. O Horiza não guarda os dados do seu cartão.',
  },
  faq: {
    titulo: 'Perguntas frequentes',
    itens: [
      { pergunta: 'O Horiza conecta com o meu banco?', resposta: 'Não. Você lança à mão, importa uma planilha do Excel, fala com a Siri ou, com cartões Itaú, deixa o SMS de compra lançar sozinho. Assim você não entrega a senha do banco para ninguém.' },
      { pergunta: 'Tem aplicativo para baixar no celular?', resposta: 'Não precisa. O Horiza funciona no navegador do celular e do computador. No celular, dá para colocar o atalho na tela inicial.' },
      { pergunta: 'Como funciona o teste grátis?', resposta: 'São 7 dias grátis, sem cartão de crédito. Se não assinar, você continua vendo seus dados, só não lança novos.' },
      { pergunta: 'Como pago e como cancelo?', resposta: 'O pagamento é no cartão, pelo Stripe. Você cancela quando quiser na tela Plano e continua com acesso até o fim do período pago.' },
      { pergunta: 'O lançamento automático por SMS é só para cartões Itaú?', resposta: 'Por enquanto, sim. Para os outros cartões, use a Siri, o Excel ou o lançamento à mão.' },
      { pergunta: 'O casal pode usar junto?', resposta: 'Sim, com uma conta e um login que os dois usam. Login separado para cada um ainda não existe.' },
      { pergunta: 'Meus dados estão seguros?', resposta: 'Cada conta enxerga só os próprios dados, com acesso por e-mail e senha. Seus dados não são vendidos nem compartilhados. Veja a política de privacidade.' },
    ],
    fecho: 'Ficou com dúvida? Chame no WhatsApp.',
  },
  final: {
    titulo: 'Sonhe grande. Com data marcada.',
    apoio: 'Comece hoje e veja como ficam os próximos meses.',
  },
  cookies: {
    texto: 'Usamos cookies para medir as visitas e melhorar nossos anúncios. Você pode aceitar ou recusar.',
    aceitar: 'Aceitar',
    recusar: 'Recusar',
  },
};
