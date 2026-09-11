const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const basicAuth = require('express-basic-auth');
const QRCode = require('qrcode');

const config = require('./lib/config');
const store = require('./lib/store');
const { gerarPayload } = require('./lib/pix');
const { gerarToken, verificarToken } = require('./lib/tokens');
const { enviarLinkDownload } = require('./lib/mailer');
const tpl = require('./views/templates');

const FILES_DIR = process.env.FILES_DIR || path.join(__dirname, 'data', 'files');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'data', 'uploads');
fs.mkdirSync(FILES_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '';
      cb(null, `${req.params.id}${ext}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
});

const app = express();
app.use(express.urlencoded({ extended: true }));

function produtoDoTier(tierRaw) {
  const tier = Number(tierRaw);
  return config.produtos[tier] || null;
}

// ---------- loja ----------

app.get('/', (req, res) => {
  res.send(tpl.paginaInicial());
});

app.get('/checkout/:tier', (req, res) => {
  const produto = produtoDoTier(req.params.tier);
  if (!produto) return res.status(404).send('Produto nao encontrado.');
  res.send(tpl.paginaCheckout(produto));
});

app.post('/checkout/:tier', async (req, res) => {
  const produto = produtoDoTier(req.params.tier);
  if (!produto) return res.status(404).send('Produto nao encontrado.');
  const nome = (req.body.nome || '').trim();
  const contato = (req.body.contato || '').trim();
  if (!nome || !contato) {
    return res.send(tpl.paginaCheckout(produto, 'Preencha nome e contato.'));
  }
  const pedido = await store.criarPedido({
    tier: produto.tier,
    nome,
    contato,
    valor: produto.preco,
  });
  res.redirect(`/pedido/${pedido.id}`);
});

app.get('/pedido/:id', (req, res) => {
  const pedido = store.buscarPedido(req.params.id);
  if (!pedido) return res.status(404).send('Pedido nao encontrado.');
  const produto = config.produtos[pedido.tier];
  const payload = gerarPayload({
    chave: config.pix.chave,
    nome: config.pix.nome,
    cidade: config.pix.cidade,
    valor: pedido.valor,
    txid: pedido.id,
  });
  QRCode.toDataURL(payload, { margin: 1, width: 480 }, (err, qrDataUrl) => {
    if (err) return res.status(500).send('Erro ao gerar QR code Pix.');
    res.send(tpl.paginaPedido(pedido, produto, qrDataUrl, payload));
  });
});

app.post('/pedido/:id/comprovante', (req, res, next) => {
  upload.single('comprovante')(req, res, async (err) => {
    if (err) return res.status(400).send('Falha no envio do comprovante: ' + err.message);
    const pedido = store.buscarPedido(req.params.id);
    if (!pedido) return res.status(404).send('Pedido nao encontrado.');
    if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');
    await store.atualizarPedido(pedido.id, {
      status: 'aguardando_confirmacao',
      comprovante: req.file.filename,
    });
    res.redirect(`/pedido/${pedido.id}`);
  });
});

app.get('/download/:token', (req, res) => {
  const dados = verificarToken(req.params.token, config.segredoTokens);
  if (!dados) return res.status(410).send('Link invalido ou expirado. Peca uma nova liberacao.');
  const pedido = store.buscarPedido(dados.id);
  if (!pedido || pedido.status !== 'liberado') return res.status(403).send('Pedido nao liberado.');
  const produto = config.produtos[pedido.tier];
  const caminho = path.join(FILES_DIR, produto.arquivo);
  if (!fs.existsSync(caminho)) {
    return res.status(500).send('Arquivo do produto ainda nao foi colocado no servidor. Fale com quem vendeu.');
  }
  res.download(caminho, produto.arquivo);
});

// ---------- admin ----------

const adminAuth = basicAuth({
  users: { [config.admin.usuario]: config.admin.senha },
  challenge: true,
  realm: 'caso-master-admin',
});

app.get('/admin', adminAuth, (req, res) => {
  res.send(tpl.paginaAdmin(store.listarPedidos()));
});

app.get('/admin/comprovante/:id', adminAuth, (req, res) => {
  const pedido = store.buscarPedido(req.params.id);
  if (!pedido || !pedido.comprovante) return res.status(404).send('Sem comprovante.');
  res.sendFile(path.join(UPLOADS_DIR, pedido.comprovante));
});

app.post('/admin/pedido/:id/liberar', adminAuth, async (req, res) => {
  const pedido = store.buscarPedido(req.params.id);
  if (!pedido) return res.status(404).send('Pedido nao encontrado.');
  const token = gerarToken(pedido.id, config.segredoTokens, config.linkValidoHoras);
  const atualizado = await store.atualizarPedido(pedido.id, {
    status: 'liberado',
    downloadToken: token,
    downloadExpiraEm: new Date(Date.now() + config.linkValidoHoras * 3600 * 1000).toISOString(),
  });
  const produto = config.produtos[atualizado.tier];
  const linkDownload = `${config.urlBase}/download/${token}`;
  try {
    await enviarLinkDownload({
      paraEmail: atualizado.contato,
      nomeCliente: atualizado.nome,
      produtoNome: produto.nome,
      linkDownload,
    });
  } catch (e) {
    console.error('Falha ao enviar e-mail, use o link manual no painel:', e.message);
  }
  res.redirect('/admin');
});

app.post('/admin/pedido/:id/recusar', adminAuth, async (req, res) => {
  const pedido = store.buscarPedido(req.params.id);
  if (!pedido) return res.status(404).send('Pedido nao encontrado.');
  await store.atualizarPedido(pedido.id, { status: 'recusado' });
  res.redirect('/admin');
});

app.get('/saude', (req, res) => res.send('ok'));

app.listen(config.porta, () => {
  console.log(`Loja Caso Master rodando em http://localhost:${config.porta}`);
  console.log(`Painel admin em ${config.urlBase}/admin (usuario: ${config.admin.usuario})`);
  if (!config.pix.chave) {
    console.warn('AVISO: PIX_KEY nao configurada no .env. O QR code Pix nao vai funcionar.');
  }
});
