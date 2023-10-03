# Use an official Node.js runtime as the base image
FROM node:alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json .

# Install application dependencies
RUN npm install
RUN npm i -g sqlite3
RUN npm i -g sequelize


# Copy the rest of the application code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 4000

# Start the Node.js application
CMD ["npm", "start"]
