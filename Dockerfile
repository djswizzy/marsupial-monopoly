# Game server for Marsupial Monopoly (Node + Express + Socket.IO)
FROM node:20-alpine

WORKDIR /app

# Install dependencies (server needs server/, lib/, and package.json)
COPY package.json package-lock.json ./
RUN npm ci

# Copy only what the server needs
COPY server ./server
COPY lib ./lib

EXPOSE 3001

# Override with PORT and ALLOWED_ORIGINS at run time
ENV PORT=3001
CMD ["npx", "tsx", "server/index.ts"]
