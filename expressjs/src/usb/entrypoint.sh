#!/usr/bin/env sh

tmp_mount='/tmp/_balena'
mkdir -p "$tmp_mount"

# This script only works in a privileged container and is checked here
if mount -t devtmpfs none "$tmp_mount" > /dev/null 2>&1; then
  PRIVILEGED=true
  umount "$tmp_mount"
else
  PRIVILEGED=false
fi
rm -rf "$tmp_mount"

mount_dev()
{
  tmp_dir='/tmp/tmpmount'
  mkdir -p "$tmp_dir"
  mount -t devtmpfs none "$tmp_dir"
  mkdir -p "$tmp_dir/shm"
  mount --move /dev/shm "$tmp_dir/shm"
  mkdir -p "$tmp_dir/mqueue"
  mount --move /dev/mqueue "$tmp_dir/mqueue"
  mkdir -p "$tmp_dir/pts"
  mount --move /dev/pts "$tmp_dir/pts"
  touch "$tmp_dir/console"
  mount --move /dev/console "$tmp_dir/console"
  umount /dev || true
  mount --move "$tmp_dir" /dev

  # Since the devpts is mounted with -o newinstance by Docker, we need to make
  # /dev/ptmx point to its ptmx.
  # ref: https://www.kernel.org/doc/Documentation/filesystems/devpts.txt
  ln -sf /dev/pts/ptmx /dev/ptmx

  sysfs_dir='/sys/kernel/debug'

  # When using io.balena.features.sysfs the mount point will already exist. We check it here. 
  if ! mountpoint -q "$sysfs_dir"; then
    mount -t debugfs nodev "$sysfs_dir"
  fi
}

start_udev()
{
  # Check that the UDEV env is set in the compose file.
  if [ "$UDEV" = "on" ]; then
    if $PRIVILEGED; then
      mount_dev
      # Start udev to listen for USB devices
      unshare --net udevd --daemon > /dev/null 2>&1
      # Check for devices connected to the host before the container started and mount them
      udevadm trigger --action add --subsystem-match=block --type=devices --property=DEVTYPE=partition > /dev/null 2>&1
    else
      echo "Unable to enable USB mounting support, container must be run in privileged mode."
    fi
  fi
}

UDEV=$(echo "$UDEV" | awk '{print tolower($0)}')

case "$UDEV" in
  '1' | 'true')
    UDEV='on'
  ;;
esac

start_udev
exec "$@"
