FROM node:18
WORKDIR /app
ENV MEDIASOUP_ANNOUNCED_IP=i12a307.p.ssafy.io
COPY package.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]