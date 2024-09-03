FROM node:20.11-alpine3.18 AS package

# Set the working directory
WORKDIR /app

COPY package*.json ./

# Install all the dependencies
RUN npm install --force

FROM node:20.11-alpine3.18  AS production
WORKDIR /app
COPY --from=package /app ./
COPY . .
# copy environment file
COPY ./apps/superApp/.env.build ./apps/superApp/.env
# Generate the build of the application
RUN npm run build:auth
# run app
ENV NODE_ENV=production
CMD ["npm" ,"start:auth"]
EXPOSE 3000

