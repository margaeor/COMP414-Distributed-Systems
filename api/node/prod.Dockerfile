FROM node:12

WORKDIR /usr/src/app

COPY ./ /usr/src/app/

RUN npm i

CMD npm run dev