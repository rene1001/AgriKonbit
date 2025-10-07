FROM node:18-alpine

WORKDIR /app

COPY client/package.json client/package-lock.json* ./
RUN npm install --production=false || true

COPY client ./

EXPOSE 3000
CMD ["npm", "start"]
