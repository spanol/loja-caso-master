// Armazenamento simples em arquivo JSON. Sem banco de dados: o volume esperado
// de uma loja low ticket vendida manualmente nao justifica isso, e evita
// dependencias nativas dentro do container Docker.

const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'db.json');

let writeQueue = Promise.resolve();

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ pedidos: [] }, null, 2));
  }
}

function readAll() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { pedidos: [] };
  }
}

function writeAll(data) {
  writeQueue = writeQueue.then(() => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  });
  return writeQueue;
}

function gerarId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

async function criarPedido({ tier, nome, contato, valor }) {
  const data = readAll();
  const pedido = {
    id: gerarId(),
    tier,
    nome,
    contato,
    valor,
    status: 'aguardando_pagamento',
    comprovante: null,
    downloadToken: null,
    downloadExpiraEm: null,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  data.pedidos.push(pedido);
  await writeAll(data);
  return pedido;
}

function buscarPedido(id) {
  const data = readAll();
  return data.pedidos.find((p) => p.id === id) || null;
}

function listarPedidos() {
  const data = readAll();
  return data.pedidos.slice().sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));
}

async function atualizarPedido(id, patch) {
  const data = readAll();
  const idx = data.pedidos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.pedidos[idx] = {
    ...data.pedidos[idx],
    ...patch,
    atualizadoEm: new Date().toISOString(),
  };
  await writeAll(data);
  return data.pedidos[idx];
}

module.exports = {
  criarPedido,
  buscarPedido,
  listarPedidos,
  atualizarPedido,
};
