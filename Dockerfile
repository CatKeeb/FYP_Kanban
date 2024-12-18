# Use the official image as a parent image
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Copy the file from your host to your current location
COPY package.json ./

# Run the command inside your image filesystem
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs in
#EXPOSE 3000
EXPOSE 3000

# Run the specified command within the container
#CMD [ "node", "server.js" ]

# Start the application
CMD [ "npm", "start" ]
