FROM node:16.13.1 AS ui-build
RUN mkdir frontend
WORKDIR /frontend
COPY package*.js frontend/package*.js
COPY . .
RUN npm install
CMD ["npm", "run", "serve"]