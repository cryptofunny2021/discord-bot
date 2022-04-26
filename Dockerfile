# syntax=docker/dockerfile:1.2

FROM node:lts-alpine AS base

WORKDIR /home/node

COPY codegen.yml package.json yarn.lock ./

FROM base AS deps

RUN yarn --production --silent --frozen-lockfile

FROM deps AS build

COPY . .
RUN yarn --silent --frozen-lockfile
RUN --mount=type=secret,id=dotenv,dst=.env yarn build

FROM base AS final

USER node

COPY --chown=node:node --from=deps /home/node/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/build ./build
COPY --chown=node:node prisma .

RUN yarn prisma generate

CMD yarn migrate && yarn start
