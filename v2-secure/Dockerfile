# v2 secure Dockerfile

FROM node:18

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY ./app .

ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]