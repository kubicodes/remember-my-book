FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package*.json .

# Install dev dependencies as well for now
RUN npm install

COPY . .

RUN npm run build

# Production Container
FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY ./config/production.yml ./config/production.yml

CMD ["node", "dist/app.js"]
