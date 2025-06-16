import fs from 'fs-extra'
import { dialog } from 'electron'

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
      const projectObj = await fs.readJSON(filePath)
      return { filePath, projectObj }
    }
  })

  async function saveProject(filePath, projectObj) {
    await fs.writeJSON(filePath, projectObj)
    return { filePath, projectObj }
  }

  ipcMain.handle('create-project-file', async (__, ...args) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [{ name: 'tt.json', extensions: ['.tt.json'] }]
    })
    if (canceled) {
      return { filePath: null }
    } else {
      const [projectObj] = args
      return await saveProject(filePath, projectObj)
    }
  })

  ipcMain.handle('update-project-file', async (__, ...args) => {
    const [filePath, projectObj] = args
    return await saveProject(filePath, projectObj)
  })
}
