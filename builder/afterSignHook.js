"use strict";

const { notarize } = require("@electron/notarize");
const {
  ELECTRON_SKIP_NOTARIZATION,
  XCODE_APP_LOADER_EMAIL,
  XCODE_APP_LOADER_PASSWORD,
} = process.env;

async function main(context) {
  const { electronPlatformName, appOutDir } = context;

  if (
    electronPlatformName !== "darwin" ||
    ELECTRON_SKIP_NOTARIZATION === "true" ||
    !XCODE_APP_LOADER_EMAIL ||
    !XCODE_APP_LOADER_PASSWORD
  ) {
    console.log("Skipping Apple notarization.");
    return;
  }

  console.log("Starting Apple notarization.");

  const appName = context.packager.appInfo.productFilename;

  await notarize({
    appBundleId: "io.balena.starterinterface",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: XCODE_APP_LOADER_EMAIL,
    appleIdPassword: XCODE_APP_LOADER_PASSWORD,
  });
}

exports.default = main;
