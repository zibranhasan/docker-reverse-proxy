# Use official Node.js 20 LTS Alpine image (lightweight and secure)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Copy package manifests first for optimal Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --no-audit

# Copy application source files
COPY . .

# Change ownership of application files to the built-in non-root 'node' user
RUN chown -R node:node /usr/src/app

# Run as non-root user for security
USER node

# Document internal container port
EXPOSE 3000

# Start the application using the start script defined in package.json
CMD ["npm", "start"]
