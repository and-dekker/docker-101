FROM node:13.10.1-alpine3.11

COPY . /root/app

WORKDIR /root/app

RUN npm ci

ENV PORT=${PORT:-3030}
ENV OTHER_CONTAINER=${OTHER_CONTAINER:-localhost}
ENV OTHER_PORT=${OTHER_PORT:-8080}

EXPOSE ${PORT:-3030}

CMD ["npm", "run", "start"]