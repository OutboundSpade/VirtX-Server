FROM node:17-alpine
WORKDIR /data
COPY . .
RUN npm install
CMD node .
