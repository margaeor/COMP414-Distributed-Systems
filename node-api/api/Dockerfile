FROM node:10-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN apk add --update python krb5 krb5-libs gcc make g++ krb5-dev

RUN mkdir -p /usr/src/app
RUN mkdir /.npm
RUN mkdir /.config

WORKDIR /usr/src/app

COPY ./src/ /usr/src/app/

# RUN chown -R nobody.nobody /usr/src/app/ && \
#     chown -R nobody:nobody /.npm && \
#     chown -R nobody:nobody /.config &&\
#     chown -R nobody:nobody /usr/local/
# RUN chmod 777 /usr/src/app/

# USER nobody

RUN npm install

#RUN npm install pm2 -g
RUN npm install supervisor -g

WORKDIR /usr/src/app

EXPOSE 8080

#CMD [ "pm2-runtime","start","ecosystem.config.js","--only","dev" ]
CMD npm install && supervisor app.js
