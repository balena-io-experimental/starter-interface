# Balena device UI

A community-built starter user interface for using Balena devices.

<img width="1288" alt="ui" src="https://user-images.githubusercontent.com/64841595/154854103-2e37d96a-81ab-4fc4-aa28-faefff4d5188.png">

# Description

This project contains an ExpressJS web application framework which provides a Quasar (Vue) interface to users. It also includes an optional Wi-Fi connect component allowing users to connect devices to nearby networks.

It is modular allowing contributions from the community and easier tracking of changes in your own projects. See the sections below for customising the interface.

# Adding components to your page

Pre-built components for adding to a page: https://github.com/maggie0002/balena-device-ui/tree/main/ui/src/components

To add a component, import the component and add `<component-name />` where you require the component. An example insert of a system-info component can be found here: https://github.com/maggie0002/balena-device-ui/blob/main/ui/src/pages/SystemInfo.vue

Supervisor and Balena SDK requests for interacting with the device are stored here: https://github.com/maggie0002/balena-device-ui/tree/main/ui/src/api. These are utilised in the components but can be used directly too.

# Adding custom endpoints

A backend for performing functions on the device is included. This is used to interact with the Balena supervisor. You can however, also add your own backend endpoints to interact with other peripherals or software here: https://github.com/maggie0002/balena-device-ui/blob/main/expressjs/src/routes/v1/CustomRoutes.ts

# Wi-Fi

The Wi-Fi component is maintained on a different repository: https://github.com/maggie0002/balena-py-wifi-connect. It is a backend for interacting with the Wi-Fi chip on devices, allowing searching for nearby connections, connecting to a network and disconnecting. It is integrated into this project by default but can be removed by deleting it from the docker-compose.yml file.

<img width="569" alt="Screenshot 2021-11-15 at 10 03 50" src="https://user-images.githubusercontent.com/64841595/141763447-534ddcd6-5939-4f14-970e-ccf8b7a106c6.png">

To use it, simply insert the component where you want it on your interface: `<wifi-connect />`. There is an example included in this project: https://github.com/maggie0002/balena-device-ui/blob/main/ui/src/pages/Networking.vue

# Menu items

Changes to the menu items can be made through: https://github.com/maggie0002/balena-device-ui/tree/main/ui/src/components/styles/menuList.ts.

# i18n

Multiple language support is added, and language strings are set here: https://github.com/maggie0002/balena-device-ui/tree/main/ui/src/i18n

To insert additional languages see the Quasar docs: https://quasar.dev/options/app-internationalization#add-new-language

# Final thoughts

Apologies the documentation here is not better for beginner users. Community contributions to improving these would be very welcome. This is undergoing development and the docs will be updated soon.
