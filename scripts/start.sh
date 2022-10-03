#!/usr/bin/env sh

# This start script is used to set global environment variables required by the app before 
# starting it

# Import env variables from the file
. .env_vars

# Start the interface
exec node index.js
