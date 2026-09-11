const nodemailer = require('nodemailer');
const config = require('./config');

let transporter = null;
if (config.smtp.habilitado) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.porta,
    secure: config.smtp.porta === 465,
    auth: config.smtp.usuario
      ? { user: config.smtp.usuario, pass: config.smtp.senha }
      : undefined,
  });
}

// Retorna true se enviou, false se o SMTP nao esta configurado (o chamador
// deve sempre ter um jeito manual de mandar o link tambem, via WhatsApp por
// exemplo, exibido no painel admin).
async function enviarLinkDownload({ paraEmail, nomeCliente, produtoNome, linkDownload }) {
  if (!transporter || !paraEmail || !paraEmail.includes('@')) return false;
  await transporter.sendMail({
    from: config.smtp.remetente,
    to: paraEmail,
    subject: `Seu acesso: ${produtoNome}`,
    text: `Ola, ${nomeCliente}!\n\nSeu pagamento foi confirmado. Aqui esta o link para baixar "${produtoNome}":\n${linkDownload}\n\nEste link expira em ${require('./config').linkValidoHoras} horas.\n\nQualquer duvida, e so responder este e-mail.`,
  });
  return true;
}

module.exports = { enviarLinkDownload };
