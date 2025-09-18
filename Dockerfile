# Use official Node.js 22 image
FROM node:22.19.0-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the lockfile and package.json first for better cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm build

# Expose the port your app runs on (default for react-router-serve is 3000)
EXPOSE 3000

# Start the server
CMD ["pnpm", "start"]