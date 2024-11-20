# Copy input data
mkdir -p /app/src/json
cp -rv /mnt/dashboard_input_data/. /app/src/json
#
# Build the application
npm run build

# Copy the build to the /mnt/static folder
cp -rv /app/build/. /mnt/static/
