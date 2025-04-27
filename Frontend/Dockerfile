# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install @supabase/supabase-js

# Copy the rest of the application code
COPY . .

# Expose the port Vue dev server runs on (Vite uses port 5173 by default)
EXPOSE 8000

# Run the Vue app in development mode
CMD ["npm", "run", "serve"]