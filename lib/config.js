require('dotenv').config();

const num = (v, fallback) => (v === undefined || v === '' ? fallback : Number(v));

// Chaves Pix do tipo CPF/CNPJ/telefone ficam registradas no DICT do Banco
// Central so com digitos (sem pontos, barra ou traco). Se a chave crua tiver
// 11 ou 14 digitos depois de remover a formatacao, usamos so os digitos;
// e-mail e chave aleatoria (uuid) passam direto, sem alteracao.
function normalizarChavePix(chave) {
  const bruta = (chave || '').trim();
  const somenteDigitos = bruta.replace(/[.\-/\s]/g, '');
  if (/^\d{11}$/.test(somenteDigitos) || /^\d{14}$/.test(somenteDigitos)) {
    return somenteDigitos;
  }
  return bruta;
}

const config = {
  porta: num(process.env.PORT, 3000),
  urlBase: process.env.BASE_URL || 'http://localhost:3000',
  segredoTokens: process.env.TOKEN_SECRET || 'troque-este-segredo-antes-de-ir-para-producao',
  linkValidoHoras: num(process.env.LINK_VALID_HOURS, 48),

  admin: {
    usuario: process.env.ADMIN_USER || 'admin',
    senha: process.env.ADMIN_PASSWORD || 'troque-esta-senha',
  },

  pix: {
    chave: normalizarChavePix(process.env.PIX_KEY || ''),
    nome: process.env.PIX_NAME || 'SEU NOME AQUI',
    cidade: process.env.PIX_CITY || 'SUA CIDADE',
  },

  smtp: {
    habilitado: Boolean(process.env.SMTP_HOST),
    host: process.env.SMTP_HOST || '',
    porta: num(process.env.SMTP_PORT, 587),
    usuario: process.env.SMTP_USER || '',
    senha: process.env.SMTP_PASS || '',
    remetente: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  },

  produtos: {
    1: {
      tier: 1,
      nome: 'Dossie Caso Master (PDF)',
      resumo: 'O mapa completo em PDF: rede de atores, linha do tempo, ramificacoes politicas e fundos de previdencia atingidos.',
      arquivo: 'tier1-dossie.pdf',
      preco: num(process.env.PRICE_TIER1, 27.0),
    },
    2: {
      tier: 2,
      nome: 'Dossie + documentos-chave originais',
      resumo: 'Tudo do plano anterior, mais uma selecao dos documentos originais mais importantes dos dois processos: peticao inicial, decisoes monocraticas, pareceres da PGR e o acordao.',
      arquivo: 'tier2-documentos-chave.zip',
      preco: num(process.env.PRICE_TIER2, 47.0),
    },
    3: {
      tier: 3,
      nome: 'Acervo completo do processo',
      resumo: 'Tudo dos planos anteriores, mais os 467 documentos publicos originais das duas pastas do processo (Pet 15556/DF e Rcl 88121/DF), sem cortes.',
      arquivo: 'tier3-processo-completo.zip',
      preco: num(process.env.PRICE_TIER3, 97.0),
    },
  },
};

module.exports = config;
