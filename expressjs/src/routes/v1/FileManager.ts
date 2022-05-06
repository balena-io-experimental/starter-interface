import express, { Request, RequestHandler, Response } from 'express'
import formidable from 'formidable'
import fse from 'fs-extra'
import klawSync, { Item } from 'klaw-sync'
import path from 'path'
import process from 'process'
import Logger from '@/common/logger'

interface extendKlawItem extends klawSync.Item {
  type: string
}

interface reqBodyData {
  currentPath: string
  currentPathArray: Array<string>
  newFolderName: string
}

const router = express.Router()

// Root directory for files
let rootDir = path.join(`${__dirname}/dev-storage/`)

// If on a Balena device, change local directory to local volume
if (process.env.ON_DEVICE) {
  rootDir = '/app/storage/'
}

// Prevent Directory Traversal and Null Bytes
// https://nodejs.org/en/knowledge/file-system/security/introduction/#preventing-directory-traversal
// https://nodejs.org/en/knowledge/file-system/security/introduction/#poison-null-bytes
function validatePath(checkPath: string) {
  if (checkPath.indexOf(rootDir) !== 0 || checkPath.indexOf('\0') !== -1) {
    throw new Error('User attempting to reach out of the root dir?')
  }
  return checkPath
}

// Ignore hidden directories and files
const filterFn = (item: Item) => {
  const basename = path.basename(item.path)
  return basename === '.' || basename[0] !== '.'
}

// Fetch files
function fetchList(currentPathArray: Array<string>) {
  // Check the storage directory exists
  fse.ensureDir(rootDir).catch((error) => Logger.error(error))

  // Fetch list of files
  const files = klawSync(
    validatePath(path.join(rootDir, currentPathArray.join('/'))),
    {
      depthLimit: 0,
      nodir: true,
      filter: filterFn
    }
  ) as extendKlawItem[]

  // Add 'file' tag to all files
  files.forEach((file) => {
    file.type = 'file'
  })

  // Fetch list of folders
  const folders = klawSync(
    validatePath(path.join(rootDir, currentPathArray.join('/'))),
    {
      depthLimit: 0,
      nofile: true,
      filter: filterFn
    }
  ) as extendKlawItem[]

  // Add 'folder' tag to all folders
  folders.forEach((folder) => {
    folder.type = 'folder'
  })

  // Return the combined list of folders and files
  return folders.concat(files)
}

// Routes //
router.post('/v1/filemanager/delete', (async (req: Request, res: Response) => {
  const reqBody = req.body as reqBodyData
  try {
    await fse.remove(validatePath(path.join(reqBody.currentPath)))
  } catch (error) {
    Logger.error(error)
  }
  res.json({ message: 'success' })
}) as RequestHandler)

router.get('/v1/filemanager/download', (req: Request, res: Response) => {
  res.download(validatePath(path.join(req.query.currentPath as string)))
})

router.post('/v1/filemanager/list', (req: Request, res: Response) => {
  const reqBody = req.body as reqBodyData
  res.json(fetchList(reqBody.currentPathArray))
})

router.post('/v1/filemanager/newfolder', (async (
  req: Request,
  res: Response
) => {
  const reqBody = req.body as reqBodyData
  const newFolder = validatePath(
    path.join(
      rootDir,
      reqBody.currentPathArray.join('/'),
      reqBody.newFolderName
    )
  )

  // Awaiting here as immediately after receiving a response, the UI will refresh the page.
  // If it refreshes before this completes, it could end up showing without the new folder
  await fse.ensureDir(newFolder).catch((error) => Logger.error(error))

  res.json({ message: 'success' })
}) as RequestHandler)

router.post('/v1/filemanager/upload', (req: Request, res: Response) => {
  const form = new formidable.IncomingForm({
    maxFileSize: 5000 * 1024 * 1024
  })

  form.on('error', (error) => {
    Logger.error(error)
  })

  form.on('fileBegin', (_name, file) => {
    file.filepath = validatePath(
      path.join(
        rootDir,
        // Uploader headers must be lowercase, not CamelCase
        req.headers.currentpath as string,
        file.originalFilename || file.newFilename
      )
    )
  })

  form.parse(req, () => {
    res.send('success')
  })
})

export default router
