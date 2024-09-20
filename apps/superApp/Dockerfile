FROM node:20.11-alpine3.18 AS development
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install --force

COPY . .

CMD npm run dev

# Use official node image as the base image
FROM node:20.11-alpine3.18 AS builder

# Set the working directory


FROM node:20.11-alpine3.18  AS production
# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json
COPY . .
# Install all the dependencies
RUN npm install --force
# copy environment file
#COPY .env.build .env
# Generate the build of the application
RUN npm run build:superApp
# Reset the environment file
RUN npm run reset
# Set the environment to production
ENV NODE_ENV=production
# Expose the port
CMD ["npm" , "run" ,"start:superApp"]
EXPOSE 3000

