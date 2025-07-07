FROM node:20.19-bullseye
WORKDIR /app
RUN chown -R node:node /app
ENV NODE_ENV=docker

COPY package*.json ./

RUN npm install

COPY --chown=node:node .env.docker ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./test ./test
COPY --chown=node:node ./input ./input

RUN npm run build

USER node

EXPOSE 3000
CMD [ "npm", "start" ]