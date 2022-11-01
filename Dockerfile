FROM node:18.7.0

WORKDIR /app

COPY . .

RUN npm install
