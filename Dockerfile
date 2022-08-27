FROM node:16-alpine

WORKDIR /app

COPY package-lock.json package-lock.json
COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]