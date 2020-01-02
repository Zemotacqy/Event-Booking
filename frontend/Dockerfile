FROM node:alpine

WORKDIR /usr/Projects/EventBooker/Frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9804

CMD ["npm", "start"]