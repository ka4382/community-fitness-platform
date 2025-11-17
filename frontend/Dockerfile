# Frontend Dockerfile (Vite / React)
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install
COPY . .
RUN npm run build

# serve with a small static server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
