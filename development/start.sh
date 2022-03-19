#!/usr/bin/env

expressjs_path=/app/expressjs/
expressjs_tar=expressjs.tar

ui_path=/app/ui/
ui_tar=ui.tar

# Import env variables to container
. .env_vars

echo "Running in hot reload mode. Setting up the environment..."

# Check if UI needs updating
echo "Checking state of UI..."
if tar --compare --file=$ui_tar --directory $ui_path &>/dev/null; then
    echo "UI is up to date."
else
# Update volume with latest UI files
    echo "Starting UI update..."
    start_time=$(date +%s)
    rm -rf $ui_path
    mkdir -p $ui_path
    tar xfp $ui_tar --directory $ui_path --atime-preserve
    rm $ui_tar
    echo "UI updated in $(($(date +%s)-$start_time)) seconds."
fi

# Check if ExpressJS needs updating
echo "Checking state of ExpressJS..."
if tar --compare --file=$expressjs_tar --directory $expressjs_path &>/dev/null; then
    echo "ExpressJS is up to date."
else
# Update volume with latest ExpressJS files
    echo "Starting ExpressJS update..."
    start_time=$(date +%s)
    rm -rf $expressjs_path
    mkdir -p $expressjs_path
    tar xfp $expressjs_tar --directory $expressjs_path --atime-preserve
    rm $expressjs_tar
    echo "ExpressJS updated in $(($(date +%s)-$start_time)) seconds."
fi

# Execute Supervisor
exec supervisord -c supervisord.conf
