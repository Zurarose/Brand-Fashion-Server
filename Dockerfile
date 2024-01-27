FROM node:18.19.0-alpine3.19 AS build

ENV NODE_ENV=development
WORKDIR /usr/src

COPY package.json /usr/src/package.json
COPY migrate-mongo-config.js /usr/src/migrate-mongo-config.js
COPY yarn.lock /usr/src/yarn.lock
RUN yarn

COPY cloud-src /usr/src/ts-build/cloud-dist
COPY migrations /usr/src/ts-build/migrations
COPY .babelrc /usr/src/ts-build/.babelrc
RUN npm run build

FROM build
ARG NODE_ENV=production
ENV NODE_ENV "$NODE_ENV"

# For "node" user its forbidden to install packages (npm EACCESS)
USER root
RUN apk --update add imagemagick

RUN mkdir -p /parse-server
WORKDIR /parse-server
COPY package.json package.json
COPY migrate-mongo-config.js migrate-mongo-config.js
COPY yarn.lock yarn.lock
RUN  yarn

COPY config config
COPY database.json database.json
COPY schema.graphql schema.graphql

# conditional COPY is currently open issue for docker
COPY .babelrc .babelrc

COPY --from=build /usr/src/js-dist/cloud-dist cloud-dist
COPY --from=build /usr/src/js-dist/migrations migrations
COPY index.js index.js

EXPOSE 1337

ENTRYPOINT ["yarn", "run", "start"]
