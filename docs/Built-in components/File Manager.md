A file manager is built into the UI. It can be used for any purpose you deem fit, but by default is pointed at an empty directory in a volume where you can upload, access and delete files and folders.

When you plug a USB drive in to your device it will be mounted in to this same directory and be visible through the File Manager.

An alternative use case is accessing the content of volumes from other containers. Change the `docker-compose.yml` file to point to the same volume as your other container uses, and you will see the volume container in the UI device manager:

```diff
services:
  balena-starter-interface:
+    volumes:
+      - "your-existing-volume:/app/storage"
+      depends_on:
+      - "your-other-container-name"
```
