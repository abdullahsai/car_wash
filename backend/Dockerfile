FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --no-fund --no-audit
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build
CMD ["node","dist/index.js"]
