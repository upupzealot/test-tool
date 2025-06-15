import fs from 'fs-extra'
import { dialog } from 'electron'

export default function init(ipcMain: Electron.IpcMain): void {
  ipcMain.handle('open-project-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'tt.json', extensions: ['.tt.json'] }]
    })
    if (canceled) {
      return null
    } else {
      return await fs.readJSON(filePaths[0])
    }
  })

  ipcMain.handle('save-project-file', async (__, ...args) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [{ name: 'tt.json', extensions: ['.tt.json'] }]
    })
    if (canceled) {
      return null
    } else {
      const [projectObj] = args
      await fs.writeJSON(filePath, projectObj)
      return filePath
    }
  })
}
