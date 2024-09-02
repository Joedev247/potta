FROM node:20.11-alpine3.18 AS builder

# Set the working directory
WORKDIR /app

COPY package*.json ./

# Install all the dependencies
RUN npm install --force

COPY ./apps/superApp .
# copy environment file
COPY ./apps/superApp/.env.build .env
# Generate the build of the application
RUN npm run build

FROM node:20.11-alpine3.18  AS production
WORKDIR /app
COPY --from=builder /app ./
#RUN npm install --force --production
ENV NODE_ENV=production
CMD ["npm" ,"start"]
EXPOSE 3000

