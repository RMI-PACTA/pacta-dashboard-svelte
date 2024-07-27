# Build Stage
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy necessary configurations to the working directory
COPY postcss.config.cjs ./
COPY svelte.config.js ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Copy the source code to the working directory
COPY src ./src
COPY static ./static
# COPY .svelte-kit ./.svelte-kit

# Build the application
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which the application will run
EXPOSE 8080

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
