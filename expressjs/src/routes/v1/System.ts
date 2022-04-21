import dns = require('dns')
import express, { Request, Response } from 'express'
import si from 'systeminformation'
import queueCache from '@/middleware/queueCache'
import Logger from '@/common/logger'

interface reqBodyData {
  cmd: string
}

const router = express.Router()

// -- Routes -- //
router.get('/v1/system/internet_check', (_req, res) => {
  Logger.debug('Running internet connectivity check.')
  dns.lookup('google.com', (error) => {
    if (error && error.code === 'ENOTFOUND') {
      res.json({ internet: false })
    } else {
      res.json({ internet: true })
    }
  })
})

router.post(
  '/v1/system/systeminfo',
  queueCache,
  async (req: Request, res: Response) => {
    const reqBody = req.body as reqBodyData
    // Sourced from: https://github.com/sebhildebrandt/systeminformation/blob/master/test/const data = await si.js
    if (reqBody.cmd === 'a') {
      try {
        const data = await si.audio()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'b') {
      try {
        const data = await si.bios()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'B') {
      try {
        const data = await si.baseboard()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'C') {
      try {
        const data = await si.chassis()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'c') {
      try {
        const data = await si.cpu()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'd') {
      try {
        const data = await si.diskLayout()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'D') {
      try {
        const data = await si.disksIO()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'e') {
      try {
        const data = await si.blockDevices()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'E') {
      try {
        const data = await si.fsOpenFiles()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'f') {
      try {
        const data = await si.fsSize()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'F') {
      try {
        const data = await si.fsStats()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'g') {
      try {
        const data = await si.graphics()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'h') {
      try {
        const data = await si.bluetoothDevices()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'i') {
      try {
        const data = await si.inetLatency()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'I') {
      try {
        const data = await si.inetChecksite('https://systeminformation.io')
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'j') {
      try {
        const data = await si.cpuCurrentSpeed()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'l') {
      try {
        const data = await si.currentLoad()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'L') {
      try {
        const data = await si.fullLoad()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'm') {
      try {
        const data = await si.mem()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'M') {
      try {
        const data = await si.memLayout()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'o') {
      try {
        const data = await si.osInfo()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'p') {
      try {
        const data = await si.processes()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'P') {
      try {
        const data = await si.processLoad(
          'postgres, login, apache, mysql, nginx, git, node'
        )
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'r') {
      try {
        const data = await si.printer()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 's') {
      try {
        const data = await si.services('apache2, postgres, wsearch')
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'S') {
      try {
        const data = await si.shell()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'T') {
      try {
        const data = await si.cpuTemperature()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'u') {
      try {
        const data = await si.usb()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'U') {
      try {
        const data = await si.uuid()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'v') {
      try {
        const data = await si.versions()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'V') {
      try {
        const data = await si.vboxInfo()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'w') {
      try {
        const data = await si.wifiNetworks()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'W') {
      try {
        const data = await si.wifiInterfaces()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'x') {
      try {
        const data = await si.wifiConnections()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'y') {
      try {
        const data = await si.system()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'Y') {
      try {
        const data = await si.battery()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === 'z') {
      try {
        const data = await si.users()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '1') {
      try {
        const data = await si.networkInterfaceDefault()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '2') {
      try {
        const data = await si.networkGatewayDefault()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '3') {
      try {
        const data = await si.networkInterfaces()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '4') {
      try {
        const data = await si.networkStats()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '5') {
      try {
        const data = await si.networkConnections()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '6') {
      try {
        const data = await si.dockerInfo()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '7') {
      try {
        const data = await si.dockerImages()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '8') {
      try {
        const data = await si.dockerContainers(true)
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '9') {
      try {
        const data = await si.dockerContainerStats('*')
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '0') {
      try {
        const data = await si.dockerContainerProcesses('*')
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '+') {
      try {
        const data = await si.dockerVolumes()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === ',') {
      try {
        const data = await si.getStaticData()
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '.') {
      try {
        const data = (await si.getDynamicData(
          'apache2, postgres, wsearch'
        )) as unknown
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    } else if (reqBody.cmd === '/') {
      try {
        const data = (await si.getAllData(
          'apache2, postgres, wsearch'
        )) as unknown
        res.json({ data })
      } catch (error) {
        Logger.error(error)
        res.status(500)
        res.json({ error })
      }
    }
  }
)

export default router
