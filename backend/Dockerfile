# backend/Dockerfile

FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json & package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# In production, you might transpile here, but for now:
EXPOSE 5000
CMD ["npm", "start"]  # which runs node src/app.js
