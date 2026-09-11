# Loja Caso Master

Loja "low ticket" self-hosted para vender o dossie do Caso Master, com checkout
Pix direto (sem processadora, sem taxa de terceiro) e liberacao manual do
download apos conferencia do comprovante.

## Como funciona

1. O comprador escolhe um dos 3 planos e preenche nome + contato.
2. A pagina gera um QR code Pix (e o codigo "copia e cola") com o valor exato
   do plano, apontando direto para a sua chave Pix. Nao existe integracao
   bancaria: e o mesmo tipo de QR code estatico que qualquer maquininha gera.
3. O comprador paga e sobe o comprovante (imagem ou PDF) na propria pagina.
4. Voce abre `/admin` (usuario e senha do `.env`), confere o comprovante e
   clica em "Liberar". Isso gera um link de download valido por um tempo
   limitado (`LINK_VALID_HOURS`, padrao 48h) e tenta mandar por e-mail se o
   contato informado for um e-mail e o SMTP estiver configurado. O link
   tambem fica visivel no painel para voce copiar e mandar manualmente por
   WhatsApp.

Nao ha confirmacao automatica de pagamento: sem uma processadora com webhook
(Mercado Pago, Efi, AbacatePay etc.) nao tem como saber programaticamente que
um Pix caiu na sua conta pessoal. O fluxo acima e o "semi-manual" combinado.

## Antes de subir: coloque os arquivos do produto

O container nao vem com os PDFs. Coloque os 3 arquivos finais em
`data/files/` (essa pasta e montada como volume, entao pode trocar os
arquivos a qualquer momento sem rebuildar a imagem):

```
data/files/tier1-dossie.pdf
data/files/tier2-documentos-chave.zip
data/files/tier3-processo-completo.zip
```

Este projeto ja vem com um script (`scripts/montar-pacotes.sh`, veja abaixo)
que gera o tier2 e o tier3 a partir das pastas originais do processo. O tier1
(o PDF do dossie) precisa ser exportado a parte a partir do mapa em HTML.

## Deploy com Docker

```bash
cp .env.example .env
# edite o .env: PIX_KEY, PIX_NAME, PIX_CITY, ADMIN_USER, ADMIN_PASSWORD,
# TOKEN_SECRET (gere um valor aleatorio) e BASE_URL.

# garanta que data/files/ tem os 3 arquivos antes de subir
docker compose up -d --build
```

A loja sobe em `http://localhost:3000`. O painel fica em
`http://localhost:3000/admin`.

## Expondo na sua tailnet

Por padrao, uma tailnet (Tailscale) so e acessivel para os dispositivos que
estao *dentro* dela: bom para voce testar e ate vender manualmente pra
conhecidos que voce adicionar na rede, mas um comprador qualquer na internet
nao vai conseguir abrir o link.

Duas opcoes, dependendo de quem vai comprar:

- **Venda restrita / conhecidos**: adicione o comprador na sua tailnet
  (convite do Tailscale) e mande o endereco `http://<nome-da-maquina>:3000`.
- **Venda publica**: use o [Tailscale Funnel](https://tailscale.com/kb/1223/funnel)
  para expor so essa porta publicamente, sem abrir o resto da sua rede:

  ```bash
  tailscale funnel 3000
  ```

  Isso te da uma URL `https://<seu-host>.<sua-tailnet>.ts.net`, que voce
  coloca em `BASE_URL` no `.env`.

## Rodando sem Docker (para testar local)

```bash
npm install
cp .env.example .env
npm start
```

## Trocar precos

Edite `PRICE_TIER1`, `PRICE_TIER2`, `PRICE_TIER3` no `.env` (valores em
reais, com ponto decimal). Reinicie o container depois de mudar.

## Seguranca, o minimo antes de vender de verdade

- Troque `TOKEN_SECRET` e `ADMIN_PASSWORD` do `.env.example`, os valores
  padrao sao so placeholder.
- Sirva atras de HTTPS (o proprio Tailscale Funnel ja cuida disso).
- Faça backup de `data/db/db.json` de vez em quando, é o seu unico registro
  de pedidos.
