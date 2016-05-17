FROM node:0.12.9

RUN mkdir -p /service
WORKDIR /service

ADD . /service
RUN npm install -g grunt-cli
RUN npm install
RUN grunt build

CMD [ "npm", "start" ]
