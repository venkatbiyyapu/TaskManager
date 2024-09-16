# Use an official Node.js runtime as a parent image
FROM node:22.8.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
