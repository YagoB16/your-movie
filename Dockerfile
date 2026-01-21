# ========== Build Stage ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas arquivos de dependências primeiro (melhor cache)
COPY package*.json ./

RUN npm ci --only=production

# ========== Production Stage ==========
FROM node:20-alpine AS production

# Segurança: não rodar como root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

WORKDIR /app

# Copia dependências do stage anterior
COPY --from=builder /app/node_modules ./node_modules

# Copia código fonte
COPY --chown=nodeuser:nodejs ./src ./src
COPY --chown=nodeuser:nodejs package*.json ./

USER nodeuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "src/app.js"]
