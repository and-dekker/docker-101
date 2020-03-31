FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

VOLUME [ "/root/app/data" ]

CMD ["npm", "run", "start"]