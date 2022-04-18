#!/usr/bin/env
destination=/app/
source=dist/

destination_timestamp=$destination.build_timestamp
source_timestamp=$source.build_timestamp

start_time=$(date +%s)

# Import env variables to container
. .env_vars

echo "Running in hot reload mode. Setting up the development environment..."

if [ -e "$destination_timestamp" ] && [ "$(cat ${destination_timestamp})" = "$(cat ${source_timestamp})" ]; then
    echo "App is up to date."
else
    # Update volume with latest UI files
    rsync --archive --delete --inplace $source $destination
    echo "App updated."
fi

echo "Development environment ready. Setup took $(($(date +%s)-$start_time)) seconds."

# Change to app directory as `yarn --cwd` does not recognise locally set Yarn version
cd $destination

# Start dev environment
exec yarn oddev
