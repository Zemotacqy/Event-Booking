FROM node:10

WORKDIR /usr/Projects/EventBooker

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9805

CMD ["npm", "start"]