## GitHub Workflows

GitHub workflow files can be found in `.github/workflows` and are triggered automatically based on their configuration.

Secrets are required in your GitHub repository for the workflows.

### Required GitHub Secrets

#### Balena secrets:

A balenaCloud API token with access to the application. Refer to the docs [here](https://github.com/balena-community/community-cli-action) for more info.

`BALENA_TOKEN`

#### Apple and Windows signing secrets:

More information on how to generate these can be found [here](https://gist.github.com/maggie0002/a689fc01737f6a5fd72868f0f07e3d3e).

_Apple:_

```
BUILD_CERTIFICATE_BASE64
BUILD_PROVISION_PROFILE_BASE64
KEYCHAIN_PASSWORD
P12_PASSWORD
XCODE_APP_LOADER_EMAIL
XCODE_APP_LOADER_PASSWORD
```

_Windows:_

```
CSC_LINK
CSC_KEY_PASSWORD
```

### Test Builds and Deploys

`deploy-testing.yml` triggers when a pull request is raised against the branch `main`. It deploys the code to the fleets specified in the file. It is recommended to use the same fleet names (i.e. `bdi-rpi`) as code deployed to these fleet names for testing will automatically provide verbose logging for debugging.

`electron-test-build.yml` builds the Electron apps on each pull request and attaches them as assets to the workflow action found in the `Actions` tab of the repository.

They will not be signed, and the Mac ARM app will not work as unsigned apps for that platform will not open your system. It is kept to test the build process. To test the app on Mac ARM, you will need to build it locally.

### Production Builds and Deploys

`deploy-production.yml` triggers when [a tag is pushed](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-commits/managing-tags) and performs the following functions:

1. Updates the balena Hub README to match the GitHub README.
2. Deploys the code to the production fleet specified in the file.
3. Preloads the specified balenaOS images with the application.
4. Builds and signs the Electron app for Linux, Windows, Mac AMD64 and ARM.
5. Signs the Mac and Windows apps with the Apple Developer and Microsoft Developer certificates. To override signing, you can pass the `ELECTRON_SKIP_NOTARIZATION=true` environment variable to the build. You can skip Electron app build by removing the section from the workflow file.
6. Deploys the app as Docker images to GitHub container registry.
7. Creates a release on GitHub with the images and Electron apps attached.

### Linting and Code Security

`codeql-analysis.yml` and `eslint.yml` are triggered on each pull request and merge. They perform code security and linting checks. Ensure `node-version: "x.x.x"` matches the version in your Dockerfiles to ensure it lints with the correct version.

### Documentation

`deploy-docs.yml` is used to build and deploy the documentation you are viewing. It is also free to use for your own projects by editing the documentation in the `./docs` folder. More info including how to use hot-reload can be found in the documentation for the docs project [here](https://github.com/balena-io-experimental/labs-docs-builder).
