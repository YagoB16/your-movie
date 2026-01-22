# ========== Build Stage ==========
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instalamos tudo primeiro para garantir que o 'api-dev' funcione
RUN npm install

# ========== Production Stage ==========
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copia apenas as dependências de produção para o ambiente final
COPY --from=builder /app/node_modules ./node_modules
# Remove dependências de desenvolvimento para economizar espaço
RUN npm prune --production

# Copia código fonte e arquivos necessários
COPY --chown=nodeuser:nodejs ./src ./src
COPY --chown=nodeuser:nodejs package*.json ./

USER nodeuser
EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "src/app.js"]
