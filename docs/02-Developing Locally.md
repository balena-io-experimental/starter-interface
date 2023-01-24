---
sidebar_position: 1
---

## Requisites

- Node
- Yarn Classic

## Install the dependencies

```bash
yarn
```

### Development modes

#### SPA (Single Page Application)

`yarn dev` will start the front and backend in development mode with hot reload. The page will open and show the basic layout, although there will be some issues on the page as there is no balena Supervisor available to connect to. This however, is useful for layouts and visual alternations.

```bash
yarn dev
```

`yarn dev-remote` allows passing an environment variable to use for the backend. This is useful when you want to do frontend development. You can point to a device on your network that has the Starter Interface deployed, and use the backend on that device to replicate the full backend experience in your hot reload frontend running locally.

```bash
DEVICE_HOSTNAME=100.121.162.79 yarn dev-remote
```

#### Electron

```bash
yarn dev-electron
```

#### PWA (Progressive Web App)

```bash
yarn dev-pwa
```

### Build the app for production

#### SPA (Single Page Application)

```bash
yarn build
```

#### Electron

```bash
yarn build-electron
```

#### PWA (Progressive Web App)

```bash
yarn build-pwa
```

### Linting and formatting

#### Lint the code

```bash
yarn lint
```

#### User [Prettier](https://prettier.io) to format the code

```bash
yarn format
```
