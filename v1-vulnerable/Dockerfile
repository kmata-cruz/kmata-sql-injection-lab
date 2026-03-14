# v1 vulnerable Dockerfile

FROM node:18

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY ./app .

# ambiente no seguro
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]