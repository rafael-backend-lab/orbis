/**
 * ORBIS — CONFIGURAÇÃO CENTRAL
 * ----------------------------------------------------------------
 * Único arquivo a editar para ativar o checkout e trocar imagens.
 * Nenhum pagamento é processado aqui: o botão apenas abre o checkout
 * oficial da Kiwify.
 */
window.ORBIS_CONFIG = {

  /* ── CHECKOUT ──────────────────────────────────────────────────
   * Cole o link gerado no painel da Kiwify. Vazio = compra desativada.
   * Somente links https de kiwify.com.br / kiwify.com são aceitos.
   */
  CHECKOUT_URL: "",            // ex.: "https://pay.kiwify.com.br/SEU_CODIGO"

  PRODUCT_NAME: "ORBIS Executive Cyberpunk 2027",
  PRICE_LABEL: "R$ 39,90",
  CONTACT_EMAIL: "",           // suporte exibido no rodapé e no FAQ (opcional)

  /* ── IMAGENS ───────────────────────────────────────────────────
   * Linhas "// PENDENTE" = imagens ainda não enviadas. Ao adicionar o
   * arquivo em assets/img/, remova o "// PENDENTE: " da linha.
   * Arquivos em assets/img/. Na galeria do produto e na galeria
   * "Por dentro", itens cujo arquivo ainda não existe são ocultados
   * automaticamente — basta adicionar o arquivo para aparecer.
   */

  /* Galeria da primeira tela (ordem = ordem das miniaturas) */
  PRODUCT_GALLERY: [
    { src: "assets/img/capa-oficial.webp",        alt: "Capa oficial do ORBIS Executive Cyberpunk 2027" },
    { src: "assets/img/mockup-tablet.webp",       alt: "ORBIS aberto em um tablet" },
    { src: "assets/img/capas-alternativas.webp",  alt: "As capas do ORBIS lado a lado" },
    { src: "assets/img/capa-alternativa-1.webp",  alt: "Capa alternativa do ORBIS" },
    { src: "assets/img/capa-alternativa-2.webp",  alt: "Capa alternativa do ORBIS" },
    { src: "assets/img/capa-alternativa-3.webp",  alt: "Capa alternativa do ORBIS" },
    // PENDENTE: { src: "assets/img/interno-navegacao.webp",   alt: "Página de navegação com abas e hiperlinks" },
    // PENDENTE: { src: "assets/img/interno-agenda.webp",      alt: "Páginas de compromissos e projetos" },
    // PENDENTE: { src: "assets/img/interno-metas.webp",       alt: "Páginas de planejamento de metas" },
    // PENDENTE: { src: "assets/img/adesivos-amostra.webp",    alt: "Amostra dos adesivos digitais" }
  ],

  /* Imagens das seções */
  IMAGES: {
    descricao:  { src: "assets/img/mockup-tablet.webp",      alt: "ORBIS em uso em um tablet" },
    ambiente1:  { src: "assets/img/ambiente-visor.webp",     alt: "" },
    ambiente2:  { src: "assets/img/ambiente-cidade.webp",    alt: "" },
    pdfs: null,  // PENDENTE: pdfs:       { src: "assets/img/versoes-pdf.webp",        alt: "As três versões do planner ORBIS" },
    capas:      { src: "assets/img/capas-alternativas.webp", alt: "Capas alternativas do ORBIS" },
    adesivos: null,  // PENDENTE: adesivos:   { src: "assets/img/adesivos-amostra.webp",   alt: "Amostra dos adesivos digitais em PNG" },
    manual: null,  // PENDENTE: manual:     { src: "assets/img/manual.webp",             alt: "Manual de utilização do ORBIS" },
    oferta:     { src: "assets/img/capa-oficial.webp",       alt: "Capa oficial do ORBIS" }
  },

  /* Galeria "Por dentro do ORBIS" (o primeiro item ocupa destaque) */
  GALLERY: [
    { src: "assets/img/mockup-tablet.webp",      alt: "ORBIS em um tablet",          label: "Em uso" },
    { src: "assets/img/capa-oficial.webp",       alt: "Capa oficial",                label: "Capa oficial" },
    { src: "assets/img/capa-alternativa-1.webp", alt: "Capa alternativa",            label: "Capa alternativa" },
    { src: "assets/img/capa-alternativa-2.webp", alt: "Capa alternativa",            label: "Capa alternativa" },
    { src: "assets/img/capa-alternativa-3.webp", alt: "Capa alternativa",            label: "Capa alternativa" },
    // PENDENTE: { src: "assets/img/interno-navegacao.webp",  alt: "Navegação por abas",          label: "Navegação" },
    // PENDENTE: { src: "assets/img/interno-agenda.webp",     alt: "Compromissos e projetos",     label: "Agenda" },
    // PENDENTE: { src: "assets/img/interno-metas.webp",      alt: "Planejamento de metas",       label: "Metas" },
    // PENDENTE: { src: "assets/img/adesivos-amostra.webp",   alt: "Adesivos digitais",           label: "Adesivos" }
  ]
};
