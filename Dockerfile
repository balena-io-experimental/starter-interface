## Build ExpressJS backend and UI frontend
FROM node:18.12.1-alpine3.17 AS build

WORKDIR /build-context

# Copy required files for installs
COPY package.json .
COPY yarn.lock .
COPY expressjs/package.json expressjs/package.json
COPY ui/package.json ui/package.json

# Install packages
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy source files to container
COPY expressjs expressjs
COPY ui ui

# Run lint to ensure build fails if there are code issues
RUN yarn lint

# Copy the yml config file for building
COPY config*.yml .

# Build ExpressJS and UI.
RUN yarn build

# UI build is done, so we now reduce the node_modules folder down 
# to the essentials required for ExpressJS.
# Requires moving package.json due to a yarn bug: https://github.com/yarnpkg/yarn/issues/6715
RUN mv expressjs/package.json ./
RUN yarn install --frozen-lockfile --production --network-timeout 600000


## Primary container
FROM node:18.12.1-alpine3.17

# Install USB mount requirements
RUN apk add --no-cache \
    findmnt \
    grep \
    udev \
    util-linux

# Specify that this is for production
ENV NODE_ENV=production

WORKDIR /app

# Enable auto mounting of USB drives when they are plugged in
COPY expressjs/src/usb/udev/usb.rules /etc/udev/rules.d/usb.rules
COPY expressjs/src/usb/scripts /usr/src/scripts
COPY expressjs/src/usb/entrypoint.sh .
RUN chmod +x entrypoint.sh
RUN chmod +x /usr/src/scripts/*

# Copy app to container
COPY --from=build /build-context/ui/dist/spa public
COPY --from=build /build-context/expressjs/dist .
COPY --from=build /build-context/node_modules node_modules

# Copy startup scripts
COPY scripts .

# Use entrypoint to setup UDEV required for USB support
ENTRYPOINT ["./entrypoint.sh"]

# Run the start script
CMD ["sh", "start.sh"]
