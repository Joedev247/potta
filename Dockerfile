# Build Stage
FROM node:18-alpine AS BUILD_IMAGE
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build:auth
RUN rm -rf node_modules .npmrc package-lock.json # Add any other files/directories you want to remove


# Production Stage
FROM node:18-alpine AS PRODUCTION_STAGE
WORKDIR /app
COPY --from=BUILD_IMAGE /app/dist/apps/instanvi-auth /app
RUN npm install --force --production
ENV NODE_ENV=production
CMD ["npm" ,"start"]
EXPOSE 3000
