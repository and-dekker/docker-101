FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

ENV MESSAGE1=${MESSAGE1:-hello}
ENV MESSAGE2=${MESSAGE2:-world}

CMD ["npm", "run", "start"]