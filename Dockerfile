FROM node:8.14.0-alpine

ARG apiEnv=production
ARG apiUrl=https://api.resourcewatch.org
ARG wriApiUrl=https://api.skydipper.com/v1
ARG callbackUrl=https://skydipper.com/auth
ARG controlTowerUrl=https://production-api.globalforestwatch.org

ENV NODE_ENV production
ENV WRI_API_URL $wriApiUrl
ENV CONTROL_TOWER_URL $controlTowerUrl
ENV CALLBACK_URL $callbackUrl
ENV STATIC_SERVER_URL=
ENV APPLICATIONS skydipper
ENV API_ENV $apiEnv

RUN apk update && apk add --no-cache \
    build-base gcc bash git \
    cairo-dev pango-dev jpeg-dev

# Add app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --frozen-lockfile --no-cache --production

# Bundle app source
COPY . /usr/src/app
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]
