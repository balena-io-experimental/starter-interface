You can try the project with a one-click install from the balena Hub:

[![balena deploy button](https://balena.io/deploy.svg)](https://hub.balena.io/organizations/bdi/apps/starter-interface)

Alternatively, get stuck straight in by adding the interface to your existing projects using the guide below. You can configure the components you would like to appear and deploy the prebuilt image alongside your application.

## Add to your existing project

### 1. Specify your preferred configuration

The interface is configured by a `config_default.yml` file stored at the root of the project. This configuration file contains all of the components available. You can override this file by adding a `config.yml` file at the root of the project at build time.

You can also use the prebuilt image, and pass them your own `config.yml` to create your own custom interface:

1. Start by cloning the project, and starting the development environment with `yarn dev`. Although there will be some errors displayed because there is no balena Supervisor available you can see the general layout of the interface.
2. Now create a `config.yml` file at the root of the repository based on the `config_default.yml` template. Edit the file according to the components you would like to appear. You can see guidance on how to do this at the top of the config file.
3. Stop your development environment and then start it again as before with `yarn dev` and you will see the interface has altered to match your new configuration.
4. At this stage you can build the project with `yarn build` and then deploy it to your device, or you can use your new config file and apply it to the prebuilt images by following the instructions in the section below.

### 2. Add the configuration to your build

The following `Dockerfile` and `docker-compose.yml` demonstrates how:

_Dockerfile.bsi:_

```bash
# Dockerfile.bsi
FROM ghcr.io/balena-labs-research/bsi:0.0.17

COPY config.yml .

# Optionally copy in your own header logo to replace the default.
COPY logo_colour.svg public/ # Your logo for displaying on white backgrounds
COPY logo_white.svg public/ # Your logo for displaying on coloured background
```

_docker-compose.yml:_

```yml
# docker-compose.yml
version: "2"

services:
  balena-starter-interface:
    build:
      context: .
      dockerfile: Dockerfile.bsi
    environment:
      SET_HOSTNAME: "balena" # Optional. Changes the device hostname. UI will become accesible on `balena.local`.
      UDEV: on # Enables ability to auto mount USB drives in to the container
    restart: always
    ports:
      - "80:80"
    volumes:
      - "bdi_db:/app/db" # Stores UI database files
      - "bdi_storage:/app/storage" # Storage for the File Manager. See docs for more info.
    privileged: true # This can be removed if not using the USB mounting feature
    labels:
      io.balena.features.supervisor-api: 1
      io.balena.features.balena-api: 1

  your-original-service:
    image: ...
    ...

volumes:
  bdi_db:
  bdi_storage:
```
