## Adding pages

New pages can be added in `ui/src/pages`. Simply clone the `IndexPage.vue` and rename it to something that explains its content. That's all that is required. You can now refer to that page and add it into the sidebar in to your interface using `config.yml`.

## Adding components to a page

Each page available in the sidebar is able to display any number of components. Components are kept in `ui/src/components`. Components include things such as environment variable configuration, WiFi connection control panels and Container Managers.

You can add a new component by creating a file in the same folder and naming it according to the feature you are adding. You can then choose which page that component should be displayed on and where on the page by including it in your `config.yml` file.

Component pages can be built using [Quasar](https://quasar.dev) components which has extensive documentation.

## Static vs dynamic rendering at runtime

Content displayed is configured through the `config.yml` file (or `config_default.yml` when `config.yml` is absent). When `config.yml` is present, the UI is fixed to its specified state at build time, and adding in a `config.yml` file to the environment later will not impact the interface. When building from `config_default.yml` the interface can be configured at a later date by adding a `config.yml` file.

When using `config_default.yml`, the frontend has to make a request to the backend for the specified configuration file, which adds a small delay to the render (approximately 200ms). For this reason, we default to static pages when `config.yml` is provided as we assume the user has already decided on how they would want their page to appear.
