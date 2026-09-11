const config = require('../lib/config');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtBRL(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(iso) {
  return new Date(iso).toLocaleString('pt-BR');
}

function layout({ titulo, corpo, largura = '720px' }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(titulo)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#efe8d8; --surface:#faf7ef; --surface-2:#e9e1cb; --text:#211d15; --text-muted:#6b6250;
    --border:#d7ccae; --border-strong:#b9ac85; --accent:#8a2620; --accent-soft:#f0dad4;
    --gold:#8a6a1c; --gold-soft:#efe2ba; --gold-strong:#5f4a10; --ok:#3c6e3c; --ok-soft:#dfeadf;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --bg:#15130f; --surface:#1c1912; --surface-2:#262117; --text:#ece3cd; --text-muted:#a89a7c;
      --border:#3a3323; --border-strong:#544a34; --accent:#e2837a; --accent-soft:#3a221f;
      --gold:#dcb95f; --gold-soft:#332a15; --gold-strong:#eecd85; --ok:#7fbf7f; --ok-soft:#1c2f1c;
    }
  }
  *{box-sizing:border-box;}
  body{background:var(--bg); color:var(--text); font-family:'IBM Plex Sans',ui-sans-serif,sans-serif; margin:0; padding:24px 20px 64px;}
  .wrap{max-width:${largura}; margin:0 auto;}
  h1,h2,h3{font-family:'IBM Plex Serif',Georgia,serif; margin:0 0 .4em;}
  a{color:var(--accent);}
  .eyebrow{font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); margin-bottom:10px;}
  .card{background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:24px; margin-bottom:20px;}
  .btn{display:inline-block; font-family:'IBM Plex Sans',sans-serif; font-weight:600; font-size:.95rem; padding:12px 20px; border-radius:6px; border:1.5px solid var(--accent); background:var(--accent); color:#fdf6f0; text-decoration:none; cursor:pointer;}
  .btn.secondary{background:transparent; color:var(--accent);}
  .btn:disabled{opacity:.5; cursor:not-allowed;}
  .mono{font-family:'IBM Plex Mono',monospace;}
  label{display:block; font-size:.85rem; font-weight:600; margin-bottom:6px; margin-top:14px;}
  input[type=text], input[type=email], input[type=file]{width:100%; padding:10px 12px; border-radius:6px; border:1px solid var(--border-strong); background:var(--surface); color:var(--text); font-family:inherit; font-size:.95rem;}
  .muted{color:var(--text-muted); font-size:.9rem; line-height:1.55;}
  .price{font-family:'IBM Plex Mono',monospace; font-size:1.6rem; font-weight:600; color:var(--gold-strong);}
  .tag{display:inline-block; font-family:'IBM Plex Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:.05em; padding:3px 9px; border-radius:20px;}
  .tag.wait{background:var(--gold-soft); color:var(--gold-strong);}
  .tag.review{background:var(--gold-soft); color:var(--gold-strong);}
  .tag.update{background:var(--accent-soft); color:var(--accent); margin-bottom:10px;}
  .tag.ok{background:var(--ok-soft); color:var(--ok);}
  .tag.no{background:var(--accent-soft); color:var(--accent);}
  table{width:100%; border-collapse:collapse; font-size:.87rem;}
  th,td{text-align:left; padding:10px 8px; border-bottom:1px solid var(--border); vertical-align:top;}
  th{font-family:'IBM Plex Mono',monospace; font-size:10.5px; text-transform:uppercase; color:var(--text-muted);}
  .pix-box{background:var(--surface-2); border:1px dashed var(--border-strong); border-radius:6px; padding:14px; font-family:'IBM Plex Mono',monospace; font-size:12px; word-break:break-all; margin:14px 0;}
  footer{margin-top:40px; font-size:.8rem; color:var(--text-muted);}
</style>
</head>
<body>
<div class="wrap">${corpo}</div>
</body>
</html>`;
}

function paginaInicial() {
  const produtos = Object.values(config.produtos);
  const cards = produtos
    .map(
      (p) => `
    <div class="card">
      <div class="eyebrow">Tier ${p.tier}</div>
      ${p.atualizacoes ? '<div class="tag update">Recebe as novidades da semana</div>' : ''}
      <h2>${escapeHtml(p.nome)}</h2>
      <p class="muted">${escapeHtml(p.resumo)}</p>
      ${p.atualizacoes ? '<p class="muted" style="font-size:.82rem;">Inclui os novos documentos e desenvolvimentos do caso conforme saem do sigilo ao longo da proxima semana, sem custo adicional.</p>' : ''}
      <p class="price">${fmtBRL(p.preco)}</p>
      <a class="btn" href="/checkout/${p.tier}">Comprar por Pix</a>
    </div>`
    )
    .join('');
  return layout({
    titulo: 'Caso Master, o dossie',
    largura: '760px',
    corpo: `
      <div class="eyebrow">Dossie extraoficial</div>
      <h1>Caso Master: o mapa completo do processo</h1>
      <p class="muted">Reconstruimos a rede de atores, a linha do tempo e as ramificacoes do inquerito do Banco Master a partir da leitura integral de 467 documentos publicos dos dois processos em curso no STF. Escolha o pacote que faz sentido para voce.</p>
      <div class="card" style="border-left:3px solid var(--accent); background:var(--accent-soft);">
        <div class="eyebrow">Atualizacao de 11/09/2026</div>
        <p class="muted" style="color:var(--text);">O presidente do STF, Edson Fachin, forcou a abertura do sigilo no processo: um relatorio da PF revela contatos entre Daniel Vorcaro e um numero salvo como "Alexandre de Moraes Brasilia", alem de um contrato de R$ 131 milhoes com o escritorio da esposa do ministro. Julgamento em plenario previsto para 15/09/2026. Quem compra o plano intermediario ou o acervo completo recebe as atualizacoes sobre esses novos desdobramentos ao longo da proxima semana.</p>
      </div>
      ${cards}
      <footer>Pagamento via Pix direto para o vendedor. Apos o envio do comprovante, a liberacao do download e conferida manualmente e costuma sair em poucas horas.</footer>
    `,
  });
}

function paginaCheckout(produto, erro) {
  return layout({
    titulo: `Comprar: ${produto.nome}`,
    corpo: `
      <div class="eyebrow">Tier ${produto.tier}</div>
      <h1>${escapeHtml(produto.nome)}</h1>
      <p class="muted">${escapeHtml(produto.resumo)}</p>
      <p class="price">${fmtBRL(produto.preco)}</p>
      <div class="card">
        ${erro ? `<p style="color:var(--accent);">${escapeHtml(erro)}</p>` : ''}
        <form method="post" action="/checkout/${produto.tier}">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" required maxlength="120">
          <label for="contato">E-mail ou WhatsApp para receber o link</label>
          <input type="text" id="contato" name="contato" required maxlength="160" placeholder="voce@email.com ou (11) 90000-0000">
          <p class="muted" style="margin-top:14px;">No proximo passo aparece o QR code Pix e o campo para enviar o comprovante.</p>
          <button class="btn" type="submit" style="margin-top:14px; border:none;">Gerar cobranca Pix</button>
        </form>
      </div>
      <p class="muted"><a href="/">&larr; voltar aos planos</a></p>
    `,
  });
}

function statusInfo(status) {
  const map = {
    aguardando_pagamento: { tag: 'wait', texto: 'Aguardando pagamento' },
    aguardando_confirmacao: { tag: 'review', texto: 'Comprovante recebido, em analise' },
    liberado: { tag: 'ok', texto: 'Liberado' },
    recusado: { tag: 'no', texto: 'Nao confirmado' },
  };
  return map[status] || { tag: 'wait', texto: status };
}

function paginaPedido(pedido, produto, qrDataUrl, payload) {
  const info = statusInfo(pedido.status);
  let miolo = '';

  if (pedido.status === 'aguardando_pagamento') {
    miolo = `
      <div class="card">
        <h2>Pague com Pix</h2>
        <p class="muted">Escaneie o QR code com o app do seu banco, ou copie o codigo abaixo.</p>
        <div style="text-align:center; margin:18px 0;"><img src="${qrDataUrl}" width="240" height="240" alt="QR code Pix" style="border-radius:8px;"></div>
        <div class="pix-box" id="pix-payload">${escapeHtml(payload)}</div>
        <button class="btn secondary" type="button" onclick="navigator.clipboard.writeText(document.getElementById('pix-payload').textContent); this.textContent='Copiado!'">Copiar codigo</button>
      </div>
      <div class="card">
        <h2>Envie o comprovante</h2>
        <p class="muted">Depois de pagar, mande o comprovante aqui (imagem ou PDF). A liberacao e conferida manualmente.</p>
        <form method="post" action="/pedido/${pedido.id}/comprovante" enctype="multipart/form-data">
          <input type="file" name="comprovante" accept="image/*,application/pdf" required>
          <button class="btn" type="submit" style="margin-top:14px; border:none;">Enviar comprovante</button>
        </form>
      </div>`;
  } else if (pedido.status === 'aguardando_confirmacao') {
    miolo = `
      <div class="card">
        <h2>Recebemos seu comprovante</h2>
        <p class="muted">Assim que o pagamento for conferido, o link de download aparece nesta mesma pagina e tambem e enviado para <b>${escapeHtml(pedido.contato)}</b> quando for um e-mail. Pode deixar esta aba salva ou voltar aqui mais tarde.</p>
      </div>`;
  } else if (pedido.status === 'liberado') {
    miolo = `
      <div class="card">
        <h2>Pagamento confirmado</h2>
        <p class="muted">Seu link expira em ${config.linkValidoHoras} horas.</p>
        <a class="btn" href="/download/${pedido.downloadToken}">Baixar ${escapeHtml(produto.arquivo)}</a>
      </div>`;
  } else if (pedido.status === 'recusado') {
    miolo = `
      <div class="card">
        <h2>Nao conseguimos confirmar o pagamento</h2>
        <p class="muted">Se voce acha que isso e um engano, responda com o comprovante para <b>${escapeHtml(config.pix.nome)}</b> diretamente pelo contato usado na compra.</p>
      </div>`;
  }

  return layout({
    titulo: `Pedido ${pedido.id}`,
    corpo: `
      <div class="eyebrow">Pedido <span class="mono">${pedido.id}</span></div>
      <h1>${escapeHtml(produto.nome)}</h1>
      <p><span class="tag ${info.tag}">${info.texto}</span> &nbsp; <span class="price">${fmtBRL(pedido.valor)}</span></p>
      ${miolo}
      <p class="muted" style="margin-top:20px;"><a href="/pedido/${pedido.id}">atualizar esta pagina</a></p>
    `,
  });
}

function paginaAdmin(pedidos) {
  const linhas = pedidos
    .map((p) => {
      const info = statusInfo(p.status);
      const prod = config.produtos[p.tier];
      const acoes =
        p.status === 'liberado'
          ? `<span class="muted">liberado</span>`
          : `
        <form method="post" action="/admin/pedido/${p.id}/liberar" style="display:inline;">
          <button class="btn" style="padding:6px 10px; font-size:.8rem; border:none;" type="submit">Liberar</button>
        </form>
        <form method="post" action="/admin/pedido/${p.id}/recusar" style="display:inline;">
          <button class="btn secondary" style="padding:6px 10px; font-size:.8rem;" type="submit">Recusar</button>
        </form>`;
      const comprovante = p.comprovante
        ? `<a href="/admin/comprovante/${p.id}" target="_blank">ver comprovante</a>`
        : '<span class="muted">nao enviado</span>';
      const link = p.status === 'liberado' ? `<br><a class="mono" href="/download/${p.downloadToken}" style="font-size:11px;">link de download</a>` : '';
      return `<tr>
        <td class="mono">${p.id}</td>
        <td>${escapeHtml(p.nome)}<br><span class="muted">${escapeHtml(p.contato)}</span></td>
        <td>${escapeHtml(prod ? prod.nome : p.tier)}</td>
        <td class="mono">${fmtBRL(p.valor)}</td>
        <td><span class="tag ${info.tag}">${info.texto}</span></td>
        <td>${comprovante}</td>
        <td class="mono" style="font-size:11px;">${fmtData(p.criadoEm)}</td>
        <td>${acoes}${link}</td>
      </tr>`;
    })
    .join('');

  return layout({
    titulo: 'Painel, Caso Master',
    largura: '1080px',
    corpo: `
      <h1>Pedidos</h1>
      <div class="card" style="overflow-x:auto;">
        <table>
          <thead><tr><th>ID</th><th>Cliente</th><th>Produto</th><th>Valor</th><th>Status</th><th>Comprovante</th><th>Criado em</th><th>Acoes</th></tr></thead>
          <tbody>${linhas || '<tr><td colspan="8" class="muted">Nenhum pedido ainda.</td></tr>'}</tbody>
        </table>
      </div>
    `,
  });
}

module.exports = { layout, paginaInicial, paginaCheckout, paginaPedido, paginaAdmin, fmtBRL };
