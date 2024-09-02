# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build:auth
RUN rm -rf node_modules .npmrc package-lock.json # Add any other files/directories you want to remove


# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/apps/superApp /app
COPY --from=builder /app/apps/package.json /app
RUN npm install --force --production
ENV NODE_ENV=production
CMD ["npm" ,"start"]
EXPOSE 3000
