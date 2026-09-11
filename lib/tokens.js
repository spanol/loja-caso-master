// Tokens de download assinados (HMAC), sem estado no servidor alem do que ja
// fica salvo no pedido. Evita expor o id do pedido puro na URL de download e
// da um prazo de expiracao ao link.

const crypto = require('crypto');

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function fromB64url(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function assinar(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function gerarToken(pedidoId, secret, ttlHoras) {
  const exp = Date.now() + ttlHoras * 60 * 60 * 1000;
  const payload = b64url(JSON.stringify({ id: pedidoId, exp }));
  const assinatura = assinar(payload, secret);
  return `${payload}.${assinatura}`;
}

function verificarToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, assinatura] = token.split('.');
  const esperada = assinar(payload, secret);
  const a = Buffer.from(assinatura);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let dados;
  try {
    dados = JSON.parse(fromB64url(payload));
  } catch (e) {
    return null;
  }
  if (!dados.exp || Date.now() > dados.exp) return null;
  return dados;
}

module.exports = { gerarToken, verificarToken };
