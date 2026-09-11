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

const GTM_ID = 'GTM-PDKWVPMX';
const WHATSAPP_NUMBER = '5513991726826';
const DESCRICAO_PADRAO =
  'Dossie completo do Caso Master: rede de atores, linha do tempo e documentos publicos dos processos Pet 15556/DF e Rcl 88121/DF em curso no STF.';

function layout({ titulo, corpo, largura = '720px', descricao, noindex = false, caminho = '/' }) {
  const desc = descricao || DESCRICAO_PADRAO;
  const urlCanonica = `${config.urlBase}${caminho}`;
  const ogImage = `${config.urlBase}/og-image.jpg`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(titulo)}</title>
<meta name="description" content="${escapeHtml(desc)}">
${noindex ? '<meta name="robots" content="noindex,nofollow">\n' : ''}<link rel="canonical" href="${urlCanonica}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Caso Master">
<meta property="og:title" content="${escapeHtml(titulo)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${urlCanonica}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(titulo)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="apple-touch-icon" href="/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0c0b09; --surface:#18150f; --surface-2:#221d15; --text:#f3f0ea; --text-muted:#b3a890;
    --border:#332c1f; --border-strong:#4a4030; --accent:#e2534a; --accent-soft:rgba(226,83,74,.16);
    --gold:#e8c98a; --gold-soft:rgba(232,201,138,.14); --gold-strong:#e8c98a; --ok:#7fbf7f; --ok-soft:rgba(127,191,127,.14);
  }
  *{box-sizing:border-box;}
  body{background:var(--bg); color:var(--text); font-family:'IBM Plex Sans',ui-sans-serif,sans-serif; margin:0; padding:24px 20px 64px;}
  .wrap{max-width:${largura}; margin:0 auto;}
  h1,h2,h3{font-family:'IBM Plex Serif',Georgia,serif; margin:0 0 .4em;}
  a{color:var(--accent);}
  .eyebrow{font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); margin-bottom:10px;}
  .card{background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:24px; margin-bottom:20px;}
  .btn{display:inline-block; font-family:'IBM Plex Sans',sans-serif; font-weight:700; font-size:.95rem; padding:12px 20px; border-radius:6px; border:1.5px solid var(--accent); background:var(--accent); color:#1a1210; text-decoration:none; cursor:pointer;}
  .btn.secondary{background:transparent; color:var(--accent);}
  .btn:disabled{opacity:.5; cursor:not-allowed;}
  .mono{font-family:'IBM Plex Mono',monospace;}
  label{display:block; font-size:.85rem; font-weight:600; margin-bottom:6px; margin-top:14px;}
  input[type=text], input[type=email], input[type=file]{width:100%; padding:10px 12px; border-radius:6px; border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-family:inherit; font-size:.95rem;}
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
  .hero{
    margin:0 0 28px; padding:64px 40px; border-radius:12px; border:1px solid var(--border);
    background:
      linear-gradient(to bottom, rgba(9,8,7,.6) 0%, rgba(9,8,7,.4) 45%, rgba(9,8,7,.82) 100%),
      url('/background.jpg') center / cover no-repeat;
    text-align:center;
  }
  .hero .eyebrow{justify-content:center;}
  .hero h1{font-size:2.4rem; line-height:1.12; letter-spacing:-.01em;}
  .hero .stamp{
    font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase;
    color:var(--accent); border:2px double var(--accent); padding:8px 14px; border-radius:3px;
    background:var(--accent-soft); display:inline-block; transform:rotate(-2deg); margin-top:18px;
  }
  .whatsapp-float{
    position:fixed; right:18px; bottom:18px; z-index:40; display:flex; align-items:center; gap:8px;
    background:#25D366; color:#0b1a10; font-family:'IBM Plex Sans',sans-serif; font-weight:700; font-size:.85rem;
    padding:12px 16px; border-radius:999px; text-decoration:none; box-shadow:0 4px 16px rgba(0,0,0,.35);
  }
</style>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div class="wrap">${corpo}</div>
<a class="whatsapp-float" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Tenho uma duvida sobre o Caso Master.')}" target="_blank" rel="noopener">Duvidas? Fale no WhatsApp</a>
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
    caminho: '/',
    descricao:
      'Reconstruimos a rede de atores, a linha do tempo e as ramificacoes do inquerito do Banco Master a partir de 467 documentos publicos dos processos Pet 15556/DF e Rcl 88121/DF no STF.',
    corpo: `
      <div class="hero">
        <div class="eyebrow" style="display:flex;">STF &middot; Pet 15556/DF &amp; Rcl 88121/DF</div>
        <h1>Caso Master: o mapa completo do processo</h1>
        <p class="muted" style="max-width:560px; margin:0 auto;">Reconstruimos a rede de atores, a linha do tempo e as ramificacoes do inquerito do Banco Master a partir da leitura integral de 467 documentos publicos dos dois processos em curso no STF.</p>
        <div class="stamp">Peca outrora sigilosa &middot; hoje publica</div>
      </div>
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
    caminho: `/checkout/${produto.tier}`,
    noindex: true,
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
      </div>
      <script>window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'comprovante_enviado',tier:${Number(pedido.tier)},valor:${Number(pedido.valor)}});</script>`;
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
    caminho: `/pedido/${pedido.id}`,
    noindex: true,
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
    caminho: '/admin',
    noindex: true,
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
