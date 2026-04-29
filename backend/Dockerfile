FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
