FROM node:18-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json* ./
RUN npm install --production=false || true

COPY server ./
COPY migrations ./migrations

EXPOSE 5000
CMD ["npm", "run", "start"]
