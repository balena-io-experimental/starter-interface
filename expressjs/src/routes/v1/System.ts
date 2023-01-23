//
// Various system services, such as internet connectivity checks, or fetching local
// system info such as CPU usage.
//

import Logger from '@/common/logger'
import fse from 'fs-extra'
import http2 from 'http2'
import express, { Request, RequestHandler, Response } from 'express'
import si from 'systeminformation'
import yaml from 'js-yaml'

// Interface for the payload
interface BodyDataReq {
  id: string
}

// Get the ExpressJS main router process
const router = express.Router()

// -- Routes -- //

// Provide the local config.yml file to the UI
router.get('/v1/system/config_yml', (_req, res) => {
  const ymlPath = '/app/config.yml'

  // Check for and read the config.yml file
  if (fse.existsSync(ymlPath)) {
    const ymlConfig = yaml.load(fse.readFileSync(ymlPath, 'utf8'))
    return res.json(ymlConfig)
  }

  return res.json({ local_config: false })
})

// Internet connectivity check. The DNS resolution tended to use cached
// DNS responses which resulted in false positives so opting instead for a
// http2 solution
router.get('/v1/system/internet_check', (_req, res) => {
  Logger.debug('Running internet connectivity check.')

  const client = http2.connect('https://google.com')
  client.setTimeout(5000)

  client.on('connect', () => {
    res.json({ internet: true })
    client.destroy()
  })
  client.on('error', () => {
    res.json({ internet: false })
    client.destroy()
  })
  client.on('timeout', () => {
    res.json({ internet: false })
    client.destroy()
  })
})

// Fetch systeminfo
router.post('/v1/system/systeminfo', (async (req: Request, res: Response) => {
  try {
    let data = {}
    const reqBody = req.body as BodyDataReq

    // Identify what info was requested and then fetch it from the systeminformation package
    switch (reqBody.id) {
      case '/':
        data = (await si.getAllData()) as unknown as []
        break
      case 'a':
        data = await si.audio()
        break
      case 'B':
        data = await si.baseboard()
        break
      case 'Y':
        data = await si.battery()
        break
      case 'b':
        data = await si.bios()
        break
      case 'e':
        data = await si.blockDevices()
        break
      case 'h':
        data = await si.bluetoothDevices()
        break
      case 'C':
        data = await si.chassis()
        break
      case 'c':
        data = await si.cpu()
        break
      case 'j':
        data = await si.cpuCurrentSpeed()
        break
      case 'T':
        data = await si.cpuTemperature()
        break
      case 'l':
        data = await si.currentLoad()
        break
      case 'd':
        data = await si.diskLayout()
        break
      case 'D':
        data = await si.disksIO()
        break
      case '0':
        data = await si.dockerContainerProcesses()
        break
      case '8':
        data = await si.dockerContainers()
        break
      case '9':
        data = await si.dockerContainerStats()
        break
      case '7':
        data = await si.dockerImages()
        break
      case '6':
        data = await si.dockerInfo()
        break
      case '+':
        data = await si.dockerVolumes()
        break
      case 'E':
        data = await si.fsOpenFiles()
        break
      case 'f':
        data = await si.fsSize()
        break
      case 'F':
        data = await si.fsStats()
        break
      case 'L':
        data = await si.fullLoad()
        break
      case '.':
        data = await si.getStaticData()
        break
      case 'g':
        data = await si.graphics()
        break
      case 'm':
        data = await si.mem()
        break
      case 'M':
        data = await si.memLayout()
        break
      case '5':
        data = await si.networkConnections()
        break
      case '2':
        data = await si.networkGatewayDefault()
        break
      case '1':
        data = await si.networkInterfaceDefault()
        break
      case '3':
        data = await si.networkInterfaces()
        break
      case '4':
        data = await si.networkStats()
        break
      case 'o':
        data = await si.osInfo()
        break
      case 'r':
        data = await si.printer()
        break
      case 'p':
        data = await si.processes()
        break
      case 'S':
        data = await si.shell()
        break
      case 'y':
        data = await si.system()
        break
      case 'w':
        data = await si.wifiNetworks()
        break
      case 'u':
        data = await si.usb()
        break
      case 'z':
        data = await si.users()
        break
      case 'U':
        data = await si.uuid()
        break
      case 'V':
        data = await si.vboxInfo()
        break
      case 'v':
        data = await si.versions()
        break
      case 'x':
        data = await si.wifiConnections()
        break
      case 'W':
        data = await si.wifiInterfaces()
        break
      default:
        throw new Error(`Method '${reqBody.id}' is not implemented.`)
    }

    // Return the info to the UI
    res.json({ data })
  } catch (error) {
    Logger.error(error)
    res.status(500)
    res.json({ error })
  }
}) as RequestHandler)

export default router
