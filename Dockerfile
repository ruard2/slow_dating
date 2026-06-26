FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npm run db:deploy -w @slow-dating/api && node apps/api/dist/server.js"]
