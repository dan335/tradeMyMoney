FROM node:current-slim

RUN echo "Etc/UTC" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

RUN apt-get update && apt-get install -y git python make gcc build-essential libkrb5-dev openssl zlib1g-dev

ADD build /opt/app/
WORKDIR /opt/app

RUN npm install

CMD ["node", "index.js"]
