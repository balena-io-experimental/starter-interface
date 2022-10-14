# balena Starter Interface

This project is still under heavy development and subject to significant changes. Apologies if the documentation is out of date in places, we are moving quickly and will try and keep up as best as possible.

---

A community-built device interface for using balena devices. It can be used to interact with your device, or as a starter project to create your own interface.

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/balena-labs-research/starter-interface)

# Description

This project contains an ExpressJS web application framework which provides a Quasar (Vue) interface to users. It also includes an optional Wi-Fi connect component allowing users to connect devices to nearby networks.

It is modular allowing contributions from the community and ease of tracking of changes in your own projects.

Some of the features include:

- Online and offline use
- Pre-built endpoints for interacting with the balena SDK or Supervisor
- Connect the device to nearby Wi-Fi networks
- Container manager (list, stop, start, restart)
- File manager (create folders, upload, delete, etc...)
- Set, edit and remove environment variables on the device
- Configure the device hostname
- Configure the device SSID and password
- Captive portal
- System info and stats
- I18n language translations

# Screenshots

<b>User friendly dashboard:</b>

![demo](https://user-images.githubusercontent.com/64841595/191008762-ea97f42c-a7bb-4ecb-abe8-5d57874da9b3.png)

<b>Connect to nearby Wi-Fi networks:</b>

<img width="569" alt="141763447-534ddcd6-5939-4f14-970e-ccf8b7a106c6" src="https://user-images.githubusercontent.com/64841595/157092424-561961e5-6914-4e42-955f-fe8a02e9c370.png">

# Documentation

Use of the UI and technical details can be found on the [wiki](https://github.com/balena-labs-research/starter-interface/wiki).

The [Getting Started](https://github.com/balena-labs-research/starter-interface/wiki/Getting-Started) guide is a good place to start.
