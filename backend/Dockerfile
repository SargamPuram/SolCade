# Use Node.js LTS version
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port (change if different)
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
