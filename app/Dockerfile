FROM node:20-alpine AS base

FROM base as dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base as build

ENV NODE_ENV=production
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM nginx:1.25.4-alpine as deploy

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
