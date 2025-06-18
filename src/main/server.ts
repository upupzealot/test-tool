import fs from 'fs-extra'
import { dialog } from 'electron'

async function writeProject(filePath, projectObj) {
  await fs.writeJSON(filePath, projectObj)
  return { filePath, projectObj }
}

async function readProject(filePath) {
  const projectObj = await fs.readJSON(filePath)
  return { filePath, projectObj }
}

export default function init(ipcMain: Electron.IpcMain): void {
  ipcMain.handle('open-project-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'tt.json', extensions: ['.tt.json'] }]
    })
    if (canceled) {
      return { filePath: null }
    } else {
      const filePath = filePaths[0]
      return await readProject(filePath)
    }
  })

  ipcMain.handle('read-project-file', async (__, ...args) => {
    const [filePath] = args
    return await readProject(filePath)
  })

  ipcMain.handle('create-project-file', async (__, ...args) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [{ name: 'tt.json', extensions: ['.tt.json'] }]
    })
    if (canceled) {
      return { filePath: null }
    } else {
      const [projectObj] = args
      return await writeProject(filePath, projectObj)
    }
  })

  ipcMain.handle('update-project-file', async (__, ...args) => {
    const [filePath, projectObj] = args
    return await writeProject(filePath, projectObj)
  })

  ipcMain.handle('get-browser-paths', async () => {
    const chromePaths = require('chrome-paths')
    return chromePaths
  })
}
