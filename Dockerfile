FROM node:14 AS builder
WORKDIR /app
COPY . /app
ENV NODE_ENV production
RUN \
    yarn global add \
        @nestjs/cli \
    && yarn install \
    && yarn prebuild \
    && yarn build


FROM node:14-slim
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/libs /app/libs
COPY package.json ./
COPY version.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./

ENV NO_COLOR true

RUN yarn install --immutable --immutable-cache

ENTRYPOINT ["yarn", "start:prod"]