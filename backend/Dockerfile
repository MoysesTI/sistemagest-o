FROM node:20-alpine

WORKDIR /app

# Copiar apenas package files primeiro para cache de npm
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar resto do código
COPY . .

# Expor porta
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/health || exit 1

# Comando de inicialização
CMD ["node", "server.js"]
