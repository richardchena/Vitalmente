# FROM node:16.13.1 AS ui-build
# RUN mkdir frontend
# WORKDIR /frontend
# COPY package*.js frontend/package*.js
# COPY . .
# RUN npm install
# CMD ["npm", "run", "serve"]

FROM node:16.13.1
RUN  npm install -g http-server
RUN mkdir /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["http-server", "dist"]