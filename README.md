# B&M Distribuidora — Vitrine MVP

MVP funcional da vitrine de produtos da B&M Distribuidora.
Site desenvolvido por mim, sobre demanda profissional

## Funcionalidades

- Página inicial com cards dos produtos
- Pesquisa por nome, SKU, fabricante e categoria
- Página de detalhes do produto
- Formulário de interesse
- Montagem automática da mensagem
- Redirecionamento para o WhatsApp
- API local de produtos em `/api/products`
- Área do lojista protegida por login
- Cadastro, edição e remoção de produtos pelo navegador

## Como executar

1. Renomeie `.env.example` para `.env.local`
2. Instale as dependências:

```bash
npm install
```

3. Execute:

```bash
npm run dev
```

4. Acesse:

```text
http://localhost:3000
```

## Área do lojista

Abra:

```text
http://localhost:3000/lojista
```

Credenciais iniciais definidas no `.env.local`:

```text

```

Troque a senha e o `SESSION_SECRET` antes de publicar.

## API de produtos

```text
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Somente o `GET` é público. Cadastro, edição e remoção exigem login.

## Armazenamento dos produtos

- No computador, os dados são gravados em `data/products.json`.
- No Netlify, os dados são gravados automaticamente no Netlify Blobs.

O arquivo JSON também fornece os produtos iniciais no primeiro acesso. Depois
da primeira inclusão, edição ou exclusão no site publicado, o catálogo passa a
ser lido do armazenamento persistente do Netlify.

armazenamento é provisionado quando o lojista salva a primeira alteração.
