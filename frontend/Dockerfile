# 1. Node.js를 사용한 빌드 단계
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# 2. Nginx를 사용한 배포 단계
FROM nginx:stable-alpine AS production

WORKDIR /usr/share/nginx/html
COPY --from=build /app/.next /usr/share/nginx/html
COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
