FROM node:14 AS development

WORKDIR /app

COPY package*.json ./
COPY ./prisma ./prisma/

RUN npm i

COPY . .
COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]