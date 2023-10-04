# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json yarn.lock ./

# Install application dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the container
COPY . .

# Compile tsc 
RUN yarn build

# Expose the port your application will run on
EXPOSE 4000

# Start the Node.js application
CMD ["yarn", "start"]
