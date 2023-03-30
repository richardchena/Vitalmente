FROM node:16.13.1
RUN mkdir backend
WORKDIR  /backend
COPY package*.json .
COPY .env .
COPY . .
RUN npm ci
RUN npm install

CMD ["npm","start" ]