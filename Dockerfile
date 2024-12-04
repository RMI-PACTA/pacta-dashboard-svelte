# Build Stage
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy necessary configurations to the working directory
COPY postcss.config.cjs ./
COPY svelte.config.js ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install the dependencies
RUN npm install \
      && npm run prepare

# Copy the source code to the working directory
COPY src ./src
COPY static ./static
COPY scripts ./scripts

CMD ["./scripts/build.sh"]
