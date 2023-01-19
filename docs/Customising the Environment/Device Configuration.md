## USB Mounting

By default when a USB device is plugged in it will be mounted into the container and visible via the File Manager.

To disable this functionality, change `UDEV` to `off` in the `docker-compose.yml` file:

```
UDEV: off
```

## Configuring default WiFi and Network Settings

Default WiFi configuration is set in the `docker-compose.yml` file. The following parameters are configurable:

```
PWC_HOTSPOT_SSID: "Balena Starter Interface" # Name as it appears in list of WiFi networks
PWC_HOTSPOT_PASSWORD: "balena01" # Optional. Must be 8 characters or more
SET_HOSTNAME: "balena" # Optional. Changes the device hostname. UI will become accesible on `balena.local`
```
