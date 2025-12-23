FROM node:24-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD mkdir -p /output_dist && cp -rp /app/dist/. /output_dist/