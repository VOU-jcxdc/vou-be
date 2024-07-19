FROM node:18.20-alpine

ARG SERVICE_NAME

ARG STAGE

ARG NODE_MODULE_PATH

ARG IS_RUN_MIGRATION

ENV BUILD_PATH='./src/dist'

WORKDIR /src

COPY ./*.js /src/

COPY ./*.json /src/

COPY ./*.lock /src/

COPY ./apps/${SERVICE_NAME} /src/apps/${SERVICE_NAME}

COPY ./libs /src/libs

RUN apk add --no-cache bash

RUN echo "building service: ${SERVICE_NAME} with stage: ${STAGE} "

RUN yarn install

RUN yarn build:${STAGE} ${SERVICE_NAME}

EXPOSE 3000

RUN echo "#!/bin/sh" > /usr/local/bin/entrypoint.sh && \
  echo "ENV=${STAGE} node /src/dist/apps/${SERVICE_NAME}/main.js" >> /usr/local/bin/entrypoint.sh && \
  chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
