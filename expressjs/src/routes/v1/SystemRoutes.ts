import Logger from '@/common/logger'
import dns = require('dns')
import express, { Request, Response } from 'express'
import si from 'systeminformation'

interface reqBodyData {
  cmd: string
}

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

router.post('/v1/system/systeminfo', function (req: Request, res: Response) {
  const reqBody = req.body as reqBodyData
  // Sourced from: https://github.com/sebhildebrandt/systeminformation/blob/master/test/si.js
  if (reqBody.cmd === 'a') {
    si.audio()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        res.json({ err })
      })
  } else if (reqBody.cmd === 'b') {
    si.bios()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'B') {
    si.baseboard()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'C') {
    si.chassis()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'c') {
    si.cpu()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'd') {
    si.diskLayout()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'D') {
    si.disksIO()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'e') {
    si.blockDevices()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'E') {
    si.fsOpenFiles()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'f') {
    si.fsSize()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'F') {
    si.fsStats()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'g') {
    si.graphics()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'h') {
    si.bluetoothDevices()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'i') {
    si.inetLatency()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'I') {
    si.inetChecksite('https://systeminformation.io')
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'j') {
    si.cpuCurrentSpeed()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'l') {
    si.currentLoad()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'L') {
    si.fullLoad()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'm') {
    si.mem()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'M') {
    si.memLayout()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'o') {
    si.osInfo()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'p') {
    si.processes()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'P') {
    si.processLoad('postgres, login, apache, mysql, nginx, git, node')
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'r') {
    si.printer()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 's') {
    si.services('apache2, postgres, wsearch')
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'S') {
    si.shell()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'T') {
    si.cpuTemperature()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'u') {
    si.usb()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'U') {
    si.uuid()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'v') {
    si.versions()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'V') {
    si.vboxInfo()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'w') {
    si.wifiNetworks()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'W') {
    si.wifiInterfaces()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'x') {
    si.wifiConnections()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'y') {
    si.system()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'Y') {
    si.battery()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === 'z') {
    si.users()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '1') {
    si.networkInterfaceDefault()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '2') {
    si.networkGatewayDefault()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '3') {
    si.networkInterfaces()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '4') {
    si.networkStats()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '5') {
    si.networkConnections()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '6') {
    si.dockerInfo()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '7') {
    si.dockerImages()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '8') {
    si.dockerContainers(true)
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '9') {
    si.dockerContainerStats('*')
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '0') {
    si.dockerContainerProcesses('*')
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '+') {
    si.dockerVolumes()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === ',') {
    si.getStaticData()
      .then((data) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '.') {
    si.getDynamicData('apache2, postgres, wsearch')
      .then((data: unknown) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  } else if (reqBody.cmd === '/') {
    si.getAllData('apache2, postgres, wsearch')
      .then((data: unknown) => res.json({ data }))
      .catch((err: JSON) => {
        console.log(err)
        res.json({ err })
      })
  }
})

export default router
