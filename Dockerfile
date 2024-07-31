# ARG NODE_VERSION=20.11.0

# FROM node:${NODE_VERSION}-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

FROM nginx:alpine

# COPY --from=build /app/dist/fe-avema /usr/share/nginx/html

COPY /dist/hb-foody/browser /usr/share/nginx/html

COPY /scripts/default.conf /etc/nginx/conf.d/default.conf

COPY /scripts/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
