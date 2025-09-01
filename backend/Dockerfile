FROM node:20-alpine
WORKDIR /app

# Required environment variables for Prisma
ARG DATABASE_URL="postgresql://carwash:carwash@db:5432/carwash"
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --no-fund --no-audit
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build
CMD ["node","dist/index.js"]
