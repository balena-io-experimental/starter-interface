//
// Upload, edit, delete, list etc. for the UI file manager
//

import Logger from '@/common/logger'
import queueCache from '@/middleware/queueCache'
import express, { Request, RequestHandler, Response } from 'express'
import formidable from 'formidable'
import fse from 'fs-extra'
import klawSync, { Item } from 'klaw-sync'
import path from 'path'

// Extend the klaw types to allow for a custom string added
// in to store whether the item is a file or folder
interface ExtendKlawItem extends klawSync.Item {
  type: string
}

// Interface for the payload
interface BodyDataReq {
  currentPath: string
  currentPathArray: Array<string>
  newFolderName: string
  selectedPaths: Array<{ path: string }>
}

// Get the ExpressJS main router process
const router = express.Router()

// Set local directory for file and folder storage
const rootDir = '/app/storage/'

// Check the storage directory exists and if not create it
try {
  void fse.ensureDir(rootDir)
} catch (error) {
  Logger.error(error)
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

// Ignore hidden directories and files by filtering the results
const filterFn = (item: Item) => {
  const basename = path.basename(item.path)
  return basename === '.' || basename[0] !== '.'
}

// Fetch files and folders
function fetchList(currentPathArray: Array<string>) {
  // Fetch list of files
  const files = klawSync(
    validatePath(path.join(rootDir, currentPathArray.join('/'))),
    {
      depthLimit: 0,
      nodir: true,
      filter: filterFn
    }
  ) as ExtendKlawItem[]

  // Add 'file' tag to all files in our custom 'type' interface extended from klaw
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
  ) as ExtendKlawItem[]

  // Add 'folder' tag to all files in our custom 'type' interface extended from klaw
  folders.forEach((folder) => {
    folder.type = 'folder'
  })

  // Return the combined list of folders and files
  return folders.concat(files)
}

// Routes //
router.post('/v1/filemanager/delete', queueCache, (async (
  req: Request,
  res: Response
) => {
  const reqBody = req.body as BodyDataReq

  if (reqBody.currentPath) {
    // If only one item to delete
    try {
      await fse.remove(validatePath(path.join(reqBody.currentPath)))
    } catch (error) {
      Logger.error(error)
    }
  } else {
    // If multiple items to delete
    await Promise.all(
      reqBody.selectedPaths.map(async (item) => {
        try {
          await fse.remove(validatePath(path.join(item.path)))
        } catch (error) {
          Logger.error(error)
        }
      })
    )
  }
  res.json({ message: 'success' })
}) as RequestHandler)

// Send a requested file to the user
router.get('/v1/filemanager/download', (req: Request, res: Response) => {
  res.download(validatePath(path.join(req.query.currentPath as string)))
})

// List the contents of a directory
router.post('/v1/filemanager/list', (req: Request, res: Response) => {
  const reqBody = req.body as BodyDataReq
  res.json(fetchList(reqBody.currentPathArray))
})

// Create a new folder
router.post('/v1/filemanager/newfolder', (async (
  req: Request,
  res: Response
) => {
  const reqBody = req.body as BodyDataReq
  const newFolder = validatePath(
    path.join(
      rootDir,
      reqBody.currentPathArray.join('/'),
      reqBody.newFolderName
    )
  )

  // Using `await` here when creating the direcotry as immediately after receiving a response,
  // the UI will refresh the page. If it refreshes before this completes, it could end up showing
  // without the new folder
  try {
    // Create the requested directory
    await fse.ensureDir(newFolder)
    res.json({ message: 'success' })
  } catch (error) {
    Logger.error(error)
  }
}) as RequestHandler)

// Save file uploaded through the UI in to the specified folder
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
        // Uploader headers passed from the UI must be lowercase, not CamelCase
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
