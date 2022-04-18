## Build ExpressJS and UI
FROM node:16.13.2-alpine3.15 AS build

# Tell the UI that this is being deployed to a Balena device
ENV ON_DEVICE=true

# Specify that this is being built for production
ENV NODE_ENV=production

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

# Reduce the node_modules folder down to the essentials required for ExpressJS
RUN yarn workspaces focus expressjs --production


## Compile container
FROM node:16.13.2-alpine3.15

ENV NODE_ENV=production

WORKDIR /app

# Copy app to container
COPY --from=build /build-context/ui/dist/spa public
COPY --from=build /build-context/expressjs/dist .
COPY --from=build /build-context/node_modules node_modules

# Copy startup scripts
COPY scripts .

# Run the start script
CMD ["sh", "start.sh"]
