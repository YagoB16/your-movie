
---

# Your-Movie API 🎬

API REST para gerenciamento de catálogo de filmes, desenvolvida com **Node.js** e **Express**. O sistema utiliza **Firebase Firestore** para persistência e integra-se à **OMDb API** para enriquecimento automático de dados de filmes.

## 🚀 Tecnologias Utilizadas

* **Runtime:** Node.js
* **Framework:** Express
* **Banco de Dados:** Firebase Firestore
* **Autenticação:** JWT (JSON Web Token) e BCrypt para hash de senhas
* **Validação:** Zod
* **Integração:** Axios (Consumo de API Externa OMDb)
* **Documentação:** APIDoc
* **DevOps:** Docker e Docker Compose

## 🛠️ Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/your-movie.git
cd your-movie

```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo. Certifique-se de obter sua chave gratuita da OMDb em [omdbapi.com](http://www.omdbapi.com/apikey.aspx).

```env
# Configurações do Servidor
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui

# Integração Externa
API_KEY=sua_chave_omdb_aqui

# Credenciais do Firebase
FIREBASE_API_KEY=SUA_API_KEY
FIREBASE_AUTH_DOMAIN=SEU_PROJETO.firebaseapp.com
FIREBASE_PROJECT_ID=SEU_PROJECT_ID
FIREBASE_STORAGE_BUCKET=SEU_PROJETO.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID
FIREBASE_APP_ID=SEU_APP_ID
FIREBASE_MEASUREMENT_ID=SEU_MEASUREMENT_ID

```

### 3. 🔥 Configuração do Firebase (Firestore)

Para que a API funcione, você precisa configurar um projeto no Firebase Console:

1. **Crie um Projeto:** Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto chamado `movie-t3st3`.
2. **Habilite o Firestore:** No menu lateral, vá em **Firestore Database** e clique em **Criar banco de dados**.
* Escolha o modo (recomendado: *Modo de Produção* para testes reais).
* Defina o local do servidor (ex: `southamerica-east1` para o Brasil).


3. **Regras de Segurança:** Na aba "Regras", garanta que o banco permita leitura/escrita conforme sua necessidade (para desenvolvimento, você pode usar `allow read, write: if true;`, mas lembre-se de restringir depois).
4. **Obtenha as Credenciais:**
* Vá em **Configurações do Projeto** (ícone de engrenagem).
* Em "Seus aplicativos", clique no ícone **</>** (Web App) para registrar o app.
* O Firebase exibirá um objeto `firebaseConfig`. Copie esses valores para o seu arquivo `.env` local.

---

### 4. 🔑 Obtendo a API Key da OMDb

Esta API utiliza a **OMDb API** para buscar detalhes técnicos dos filmes. Siga os passos para obter sua chave gratuita:

1. Acesse o site oficial: [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx).
2. Selecione a opção **FREE** (permite até 1.000 requisições diárias).
3. Preencha o formulário com:
* **Email:** Seu e-mail válido.
* **First Name / Last Name:** Seu nome.
* **Use:** Breve descrição (ex: "Educational project for a movie catalog API").


4. **Ativação:** Você receberá um e-mail com a chave e um **link de ativação**.
> **Importante:** A chave só funcionará após você clicar no link enviado para o seu e-mail.


5. **Configuração:** Copie a chave recebida e cole no seu arquivo `.env`:
```env
API_KEY=sua_chave_aqui

```

### 5. Instalar dependências

```bash
npm install

```

## 📖 Funcionalidades Principais

* **CRUD de Filmes:** Cadastro, listagem, atualização e deleção de filmes no Firestore.
* **Busca Externa:** Consulta de filmes por título ou ID diretamente na API da OMDb.
* **Enriquecimento Automático:** Ao cadastrar um filme enviando o `imdbID`, o sistema busca automaticamente pôster, atores, diretor e notas da API externa para salvar no banco de dados.
* **Autenticação Segura:** Rotas protegidas por Middleware JWT.

## 📝 Documentação da API

A documentação detalhada (incluindo exemplos de requisição e resposta) foi gerada com o **APIDoc**.

1. Gere os arquivos:

```bash
npm run doc

```

2. Abra o arquivo `docs/index.html` em seu navegador para visualizar o dashboard interativo.

## 🐳 Executando com Docker

O projeto está configurado para rodar em containers:

```bash
docker compose --profile dev up api-dev

```

A API ficará disponível em `http://localhost:3001`.

## 🏥 Monitoramento (Health Check)

Para verificar o status do servidor e a conectividade em tempo real com o Firebase, utilize o endpoint:
`GET /system/health`

---
