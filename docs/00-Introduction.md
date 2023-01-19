---
slug: /
breadcrumbs: true
title: Introduction
---

# Balena Starter Interface

A community-built device interface for using balena devices. It can be used to interact with your device, or as a starter project to create your own interface.

_On-device Interface_

<img src="https://user-images.githubusercontent.com/64841595/191008762-ea97f42c-a7bb-4ecb-abe8-5d57874da9b3.png" alt="wifi" width="500"/>

This project contains the ability to build:

- An ExpressJS web application framework providing a Quasar (Vue) interface to users
- An Electron Application for communicating with devices on your network
- A Progressive Web App alternative.

_Electron App_

<img width="500" alt="electron" src="https://user-images.githubusercontent.com/64841595/213165616-73bc762b-0073-4407-a10d-52c8daa21333.png"/>

Some of the core features include:

- Online and offline use
- Customisable Electron and Progressive Web applications for interaction with your devices
- Pre-built endpoints for interacting with the Balena SDK or Supervisor
- Connect your device to nearby Wi-Fi networks
- Container manager (list, stop, start, restart)
- File manager (create folders, upload, delete, etc...)
- Set, edit and remove environment variables on the device
- Configure the device hostname
- Configure the device SSID and password
- Captive portal
- Automatic mounting of USB devices into the File Manager
- System info and stats
- I18n language translations

These components are optional, and easily removed or edited. The project also includes the ability to add your own components, branding and anything else you desire to get started with building a user interface for your balena devices.

# One-click deploy

[![balena deploy button](https://balena.io/deploy.svg)](https://hub.balena.io/organizations/bdi/apps/starter-interface)
