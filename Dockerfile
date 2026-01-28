FROM node:20-alpine

WORKDIR /app

# Copia dependências e instala tudo (incluindo Nodemon/Jest para facilitar sua vida)
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

EXPOSE 3000

# Usamos o comando que você já configurou no package.json
CMD ["npm", "run", "dev"]
