import Logger from '@/common/logger'
import dns = require('dns')
import express from 'express'
import si from 'systeminformation'

const router = express.Router()

// -- Routes -- //
router.get('/v1/system/internet_check', function (_req, res) {
  Logger.debug('Running internet connectivity check.')
  dns.lookup('google.com', function (err) {
    if (err && err.code == 'ENOTFOUND') {
      res.json({ internet: false })
    } else {
      res.json({ internet: true })
    }
  })
})

router.post('/v1/system/systeminfo', function (req, res) {
  // Sourced from: https://github.com/sebhildebrandt/systeminformation/blob/master/test/si.js
  if (req.body.cmd === 'a') {
    si.audio()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'b') {
    si.bios()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'B') {
    si.baseboard()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'C') {
    si.chassis()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'c') {
    si.cpu()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'd') {
    si.diskLayout()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'D') {
    si.disksIO()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'e') {
    si.blockDevices()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'E') {
    si.fsOpenFiles()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'f') {
    si.fsSize()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'F') {
    si.fsStats()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'g') {
    si.graphics()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'h') {
    si.bluetoothDevices()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'i') {
    si.inetLatency()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'I') {
    si.inetChecksite('https://systeminformation.io')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'j') {
    si.cpuCurrentSpeed()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'l') {
    si.currentLoad()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'L') {
    si.fullLoad()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'm') {
    si.mem()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'M') {
    si.memLayout()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'o') {
    si.osInfo()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'p') {
    si.processes()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'P') {
    si.processLoad('postgres, login, apache, mysql, nginx, git, node')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'r') {
    si.printer()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 's') {
    si.services('apache2, postgres, wsearch')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'S') {
    si.shell()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'T') {
    si.cpuTemperature()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'u') {
    si.usb()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'U') {
    si.uuid()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'v') {
    si.versions()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'V') {
    si.vboxInfo()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'w') {
    si.wifiNetworks()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'W') {
    si.wifiInterfaces()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'x') {
    si.wifiConnections()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'y') {
    si.system()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'Y') {
    si.battery()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === 'z') {
    si.users()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '1') {
    si.networkInterfaceDefault()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '2') {
    si.networkGatewayDefault()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '3') {
    si.networkInterfaces()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '4') {
    si.networkStats()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '5') {
    si.networkConnections()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '6') {
    si.dockerInfo()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '7') {
    si.dockerImages()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '8') {
    si.dockerContainers(true)
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '9') {
    si.dockerContainerStats('*')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '0') {
    si.dockerContainerProcesses('*')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '+') {
    si.dockerVolumes()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === ',') {
    si.getStaticData()
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '.') {
    si.getDynamicData('apache2, postgres, wsearch')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  } else if (req.body.cmd === '/') {
    si.getAllData('apache2, postgres, wsearch')
      .then((data) => res.json({ data }))
      .catch((error) => res.json({ error }))
  }
})

export default router
