FROM node:20.11-alpine3.18 AS builder

# Set the working directory
WORKDIR /app

COPY package*.json ./

# Install all the dependencies
RUN npm install --force

COPY . .
# copy environment file
COPY ./apps/superApp/.env.build ./apps/superApp/.env
# Generate the build of the application
RUN npm run build:auth

FROM node:20.11-alpine3.18  AS production
WORKDIR /app
COPY --from=builder /app/apps/superApp ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/superApp/.env ./
# Set the environment to production
ENV NODE_ENV=production
CMD ["npm" ,"start"]
EXPOSE 3000

