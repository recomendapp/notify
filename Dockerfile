FROM node:22-slim AS builder

ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}

WORKDIR /app

COPY .npmrc .npmrc

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.npmrc .npmrc

RUN npm ci --omit=dev

RUN rm -f .npmrc

EXPOSE 3000

CMD ["node", "dist/index.js"]
