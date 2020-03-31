FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "start"]