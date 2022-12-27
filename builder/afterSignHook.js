"use strict";

const { notarize } = require("@electron/notarize");
const { ELECTRON_SKIP_NOTARIZATION } = process.env;

async function main(context) {
  const { electronPlatformName, appOutDir } = context;

  if (
    electronPlatformName !== "darwin" ||
    ELECTRON_SKIP_NOTARIZATION === "true"
  ) {
    console.log("Skipping Apple notarization.");
    return;
  }

  console.log("Starting Apple notarization.");

  const appName = context.packager.appInfo.productFilename;
  const appleId = process.env.XCODE_APP_LOADER_EMAIL;
  const appleIdPassword = process.env.XCODE_APP_LOADER_PASSWORD;

  await notarize({
    appBundleId: "io.balena.starterinterface",
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    appleIdPassword,
  });
}

exports.default = main;
