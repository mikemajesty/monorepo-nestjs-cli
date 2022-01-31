FROM node:14

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/your-api

COPY apps/your-api/package.json dist/apps/your-api/
COPY apps/your-api/tsconfig.build.json dist/apps/your-api/
COPY apps/your-api/tsconfig.json dist/apps/your-api/

EXPOSE 4000

RUN yarn --cwd dist/apps/your-api
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/your-api -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:auth:prd