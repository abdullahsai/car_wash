FROM node:20-alpine
WORKDIR /app

# Required environment variables for Prisma
ARG DB_PROVIDER=sqlite
ARG DATABASE_URL="file:./dev.db"
ENV DB_PROVIDER=$DB_PROVIDER \
    DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm install --no-fund --no-audit
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build
CMD ["node","dist/index.js"]
