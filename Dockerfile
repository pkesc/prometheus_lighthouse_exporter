FROM node:12-buster-slim

WORKDIR /usr/src/app/

# Install the dependencies for Chromium
# check out: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf dumb-init \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY lighthouse_exporter.js .
COPY package.json .

RUN npm install

EXPOSE 9593

# Why dump-init
# https://paul.kinlan.me/hosting-puppeteer-in-a-docker-container/
# https://github.com/Yelp/dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "lighthouse_exporter.js"]