FROM node:22.17.0-alpine
WORKDIR /app
RUN chown -R node:node /app
ENV NODE_ENV=docker

COPY package*.json ./
RUN npm install

COPY --chown=node:node . .
RUN npm run build

USER node

EXPOSE 3000
CMD [ "npm", "start" ]