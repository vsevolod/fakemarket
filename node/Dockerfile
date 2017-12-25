FROM node:9.3

RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp
RUN npm install
CMD "tail -f /dev/null"
