#!/usr/bin/env
destination=/app/
source=dist/

# Import env variables to container
. .env_vars

echo "Running in hot reload mode. Setting up the development environment..."
start_time=$(date +%s)

rsync --archive --delete --inplace $source $destination

echo "Development environment ready. Setup took $(($(date +%s)-$start_time)) seconds."

# Start Supervisor
exec supervisord -c supervisord.conf
