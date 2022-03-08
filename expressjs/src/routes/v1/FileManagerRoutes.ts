import Logger from '@/common/logger'
import express from 'express'
import formidable from 'formidable'
import fse from 'fs-extra'
import klawSync, { Item } from 'klaw-sync'
import path from 'path'
import process from 'process'

interface extendKlawItem extends klawSync.Item {
  type: string
}

const router = express.Router()

// Root directory for files
let rootDir = '/app/storage/'

// In dev mode, change local directory
if (process.env.NODE_ENV !== 'production') {
  rootDir = path.join(__dirname + '/dev-storage/')
}

// Prevent Directory Traversal and Null Bytes
// https://nodejs.org/en/knowledge/file-system/security/introduction/#preventing-directory-traversal
// https://nodejs.org/en/knowledge/file-system/security/introduction/#poison-null-bytes
function validatePath(path: string) {
  if (path.indexOf(rootDir) !== 0 || path.indexOf('\0') !== -1) {
    Logger.warn('User attempting to reach out of the root dir?')
    throw new Error('User attempting to reach out of the root dir?')
  }
  return path
}

// Ignore hidden directories and files
const filterFn = (item: Item) => {
  const basename = path.basename(item.path)
  return basename === '.' || basename[0] !== '.'
}

// Fetch files
function fetchList(currentPath: Array<string>) {
  // Check the storage directory exists
  if (!fse.existsSync(rootDir)) {
    fse.ensureDir(rootDir).catch((err) => Logger.error(err))
  }

  // Fetch list of files
  const files = klawSync(
    validatePath(path.join(rootDir, currentPath.join('/'))),
    {
      depthLimit: 0,
      nodir: true,
      filter: filterFn
    }
  )

  // Add 'file' tag to all files
  for (const file of files as extendKlawItem[]) {
    file.type = 'file'
  }

  // Fetch list of folders
  const folders = klawSync(
    validatePath(path.join(rootDir, currentPath.join('/'))),
    {
      depthLimit: 0,
      nofile: true,
      filter: filterFn
    }
  )

  // Add 'folder' tag to all folders
  for (const folder of folders as extendKlawItem[]) {
    folder.type = 'folder'
  }

  // Return the combined list of folders and files
  return folders.concat(files)
}

// Routes //
router.post('/v1/filemanager/delete', function (req, res) {
  fse.remove(validatePath(path.join(req.body.currentPath))).catch((err) => {
    Logger.error(err)
  })
  res.json({ message: 'success' })
})

router.get('/v1/filemanager/download', function (req, res) {
  res.download(validatePath(path.join(req.query.currentPath as string)))
})

router.post('/v1/filemanager/list', function (req, res) {
  res.json(fetchList(req.body.currentPath))
})

router.post('/v1/filemanager/newfolder', function (req, res) {
  const newFolder = validatePath(
    path.join(rootDir, req.body.currentPath.join('/'), req.body.newFolderName)
  )

  fse.ensureDir(newFolder).catch((err) => Logger.error(err))

  res.json({ message: 'success' })
})

router.post('/v1/filemanager/upload', function (req, res) {
  const form = new formidable.IncomingForm({
    maxFileSize: 5000 * 1024 * 1024
  })

  form.on('error', (err) => {
    Logger.error(err)
  })

  form.on('fileBegin', function (_name, file) {
    file.filepath = validatePath(
      path.join(
        rootDir,
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
