This project is a monorepo, built around a front and backend. Both are compiled together at build time, serving the frontend from the Express backend. The below outlines the structure of the project, highlighting only the key areas where interaction tends to be needed:

```bash
./ # Docker build files and top level package.json
├── expressjs/ # Backend
    ├── src/ # ExpressJS source
        ├── boot/ # Boot files for the Express app
        ├── routes/ # ExpressJS routes for handling API endpoints
├── ui/ # Vue app
    ├── public/ # Static files available from the URL after being built
    ├── src/ # Vue source
        ├── api/ # Supervisor and SDK request functions
        ├── boot/ # Boot files for the Vue app
        ├── components/ # Vue components
        ├── layouts/ # Vue layouts
        ├── config/ # Language and style configuration of the app
        ├── i18n/ # Translation files
        ├── pages/ # Vue pages
```

Each of the components of the project have their own build and development processes, but each can access and share the same Vue page sources all stored in `ui/src/pages` and `ui/src/layouts`. Due to the different purposes of the SPA, Electron and PWA apps, each has it's own entry point where you can configure how each should start and be used.

## SPA (Single Page Application)

Single page applications are the default build process, run with `yarn dev` and built with `yarn build`. The entry point for these applications is `ui/src/App.vue`.

### Captive portal

The Captive portal is only useful on the SPA builds. It is stored in `ui/layouts/CaptivePortal.vue`.

## Electron App

The Electron App has a different entry point, as the purpose of this app is distinct from the SPA. It's entry point is `ui/layouts/ElectronLayout.vue`. It is run with `yarn dev-electron` and built with `yarn build-electron`.

## PWA App

The PWA App also has it's own entry point: `ui/layouts/PwaLayout.vue`. It is run with `yarn dev-pwa` and built with `yarn build-pwa`.
