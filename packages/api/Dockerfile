
FROM node:18-bullseye-slim as builder

WORKDIR /usr/src/app

# python3 make g++ are needed for bcrypt
RUN apt-get update && apt-get install -y openssl libssl-dev python3 make g++

# Necessary config files
COPY package*.json .
COPY packages/api/prisma ./prisma
COPY tsconfig*.json .
COPY lerna.json .

# Copy mono repo code
COPY /packages ./packages

# Install dev dependencies as well for now
RUN npm ci

COPY package*.json .
COPY lerna.json .
COPY packages/ ./packages

COPY . .

WORKDIR /usr/src/app/packages/api

# Necessary to get the types of prisma, otherwise build fails
RUN npm run prisma:generate

RUN npm run build

# Production Container
FROM  node:18-bullseye-slim as production

RUN apt-get update && apt-get install -y openssl libssl-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY ./config/production.yml ./config/production.yml

CMD ["node", "dist/app.js"]
