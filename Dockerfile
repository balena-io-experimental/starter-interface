## Build ExpressJS and UI
FROM node:18.7.0-alpine3.16 AS build

# Specify that this is being built for production
ENV NODE_ENV=production

# Public path for PWA
ARG PUBLIC_PWA_PATH=/app

WORKDIR /build-context

# Copy required files for installs
COPY package.json .
COPY yarn.lock .
COPY expressjs/package.json expressjs/package.json
COPY ui/package.json ui/package.json
COPY .yarn .yarn
COPY .yarnrc.yml .

# Install packages
RUN yarn install --immutable

# Copy source files to container
COPY expressjs expressjs
COPY ui ui

# Run lint to ensure build fails if there are coding issues
RUN yarn lint

# Build ExpressJS and UI
RUN yarn build
RUN yarn build-pwa

# Reduce the node_modules folder down to the essentials required for ExpressJS
RUN yarn workspaces focus expressjs --production


## Compile container
FROM node:18.7.0-alpine3.16

# Install USB mount requirements
RUN apk add --no-cache \
    findmnt \
    grep \
    udev \
    util-linux

ENV NODE_ENV=production

WORKDIR /app

# Enable USB support on device
ENV UDEV=on
COPY expressjs/src/usb/udev/usb.rules /etc/udev/rules.d/usb.rules
COPY expressjs/src/usb/scripts /usr/src/scripts
COPY expressjs/src/usb/entrypoint.sh .
RUN chmod +x entrypoint.sh
RUN chmod +x /usr/src/scripts/*

# Copy app to container
COPY --from=build /build-context/ui/dist/spa public
COPY --from=build /build-context/ui/dist/pwa public/app
COPY --from=build /build-context/expressjs/dist .
COPY --from=build /build-context/node_modules node_modules

# Copy startup scripts
COPY scripts .

# Setup UDEV for USB support
ENTRYPOINT ["./entrypoint.sh"]

# Run the start script
CMD ["sh", "start.sh"]
