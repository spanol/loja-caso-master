// Gerador de payload Pix estatico/dinamico (BR Code, padrao EMV do Banco Central).
// Nao depende de nenhuma processadora ou conta comercial: usa so a chave Pix do
// recebedor. O comprador escaneia ou copia e cola no app do banco dele.
// Referencia do formato: Manual de Padroes para Iniciacao do Pix (Bacen).

function tlv(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

// CRC16/CCITT-FALSE, exigido pelo padrao EMV para o campo final (63).
function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function sanitize(str, maxLen) {
  const cleaned = String(str)
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
    .replace(/[^\x20-\x7E]/g, '') // so ASCII imprimivel
    .trim();
  return cleaned.slice(0, maxLen);
}

/**
 * @param {Object} opts
 * @param {string} opts.chave        Chave Pix do recebedor (CPF/CNPJ/e-mail/telefone/aleatoria)
 * @param {string} opts.nome         Nome do recebedor (ate 25 caracteres)
 * @param {string} opts.cidade       Cidade do recebedor (ate 15 caracteres)
 * @param {number} opts.valor        Valor em reais, ex: 47.00
 * @param {string} opts.txid         Identificador do pedido (alfanumerico, ate 25 caracteres)
 * @returns {string} payload "copia e cola" pronto para QR code
 */
function gerarPayload({ chave, nome, cidade, valor, txid }) {
  const merchantName = sanitize(nome, 25) || 'CASO MASTER';
  const merchantCity = sanitize(cidade, 15) || 'BRASIL';
  const referenceLabel = sanitize(txid, 25).replace(/[^A-Za-z0-9]/g, '') || '***';
  const amount = Number(valor).toFixed(2);

  const merchantAccountInfo =
    tlv('00', 'BR.GOV.BCB.PIX') +
    tlv('01', chave);

  const additionalData = tlv('05', referenceLabel);

  const fields = [
    tlv('00', '01'),                       // payload format indicator
    tlv('01', '12'),                       // dynamic-style single use
    tlv('26', merchantAccountInfo),        // dados da conta Pix
    tlv('52', '0000'),                     // merchant category code
    tlv('53', '986'),                      // moeda: BRL
    tlv('54', amount),                     // valor da cobranca
    tlv('58', 'BR'),                       // pais
    tlv('59', merchantName),               // nome do recebedor
    tlv('60', merchantCity),               // cidade do recebedor
    tlv('62', additionalData),             // txid / referencia do pedido
  ].join('');

  const withCrcPlaceholder = `${fields}6304`;
  const crc = crc16(withCrcPlaceholder);
  return `${withCrcPlaceholder}${crc}`;
}

module.exports = { gerarPayload };
