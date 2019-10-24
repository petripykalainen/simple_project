FROM node:alpine

WORKDIR /usr/app

COPY package.json .
RUN npm install
COPY . .
RUN chmod +x ./entrypoint.sh
CMD ["npm", "run", "start"]
