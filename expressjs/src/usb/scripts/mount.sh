#!/usr/bin/env sh

# This script gets executed by a UDev rule whenever an external drive is plugged in.
# The following env variables are set by UDev, but can be obtained if the script is executed outside of UDev context:
# - DEVNAME: Device node name (i.e: /dev/sda1)
# - ID_BUS: Bus type (i.e: usb)
# - ID_FS_TYPE: Device filesystem (i.e: vfat)
# - ID_FS_UUID_ENC: Partition's UUID (i.e: 498E-12EF)
# - ID_FS_LABEL_ENC: Partition's label (i.e: YOURDEVICENAME)

# Make sure we have a device name
DEVNAME=${DEVNAME:=$1}
if [ -z "$DEVNAME" ]; then
  echo "usb-mount: Invalid device name: $DEVNAME" > /proc/1/fd/2
  exit 1
fi

# Check if DEVNAME starts with /dev/sd
if [ "${DEVNAME:0:7}" != "/dev/sd" ]; then
  # Device is not a USB drive, skipping
  exit 0
fi

# Get required device information
ID_FS_TYPE=${ID_FS_TYPE:=$(udevadm info -n "$DEVNAME" | awk -F "=" '/ID_FS_TYPE/{ print $2 }')}
ID_FS_UUID_ENC=${ID_FS_UUID_ENC:=$(udevadm info -n "$DEVNAME" | awk -F "=" '/ID_FS_UUID_ENC/{ print $2 }')}
ID_FS_LABEL_ENC=${ID_FS_LABEL_ENC:=$(udevadm info -n "$DEVNAME" | awk -F "=" '/ID_FS_LABEL_ENC/{ print $2 }')}

# If UUID is empty add alternative
if [ -z "$ID_FS_UUID_ENC" ]; then
  ID_FS_UUID_ENC="none"
fi

# Check all the variables are now full
if [ -z "$ID_FS_TYPE" ] || [ -z "$ID_FS_UUID_ENC" ] || [ -z "$ID_FS_LABEL_ENC" ]; then
  echo "usb-mount: Could not get required device information for: $DEVNAME. Skipping." > /proc/1/fd/2
  exit 1
fi

# Construct the mount point path
MOUNT_POINT=/app/storage/USB-"$ID_FS_LABEL_ENC"-"$ID_FS_UUID_ENC"

# Abort if file system is not supported by the kernel
if ! grep -qw "$ID_FS_TYPE" /proc/filesystems; then
 echo "usb-mount: File system not supported: $ID_FS_TYPE" > /proc/1/fd/2
  exit 1
fi
 
# Mount device
if findmnt -rno SOURCE,TARGET "$DEVNAME" >/dev/null; then
 echo "Device $DEVNAME is already mounted" > /proc/1/fd/2
else
 echo "usb-mount: Mounting device: $DEVNAME" > /proc/1/fd/1
    mkdir -p "$MOUNT_POINT"
    mount -t "$ID_FS_TYPE" -o rw "$DEVNAME" "$MOUNT_POINT"
fi
