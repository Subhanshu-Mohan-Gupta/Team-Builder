FROM node:latest

WORKDIR /usr/src/index

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 4000

CMD ["node", "index.js"]

