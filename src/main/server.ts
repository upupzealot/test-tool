import fs from 'fs-extra'
import { dialog } from 'electron'
import puppeteer from 'puppeteer-core'

import delay from './delay'

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

  ipcMain.handle('test-browser', async (__, ...args) => {
    const [browserPath, testUrl] = args

    const windowWidth = 640
    const windowHeight = 640
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: browserPath,
      defaultViewport: null,
      args: [`--window-size=${windowWidth},${windowHeight}`]
    })
    const [page] = await browser.pages()
    page.on('close', () => {
      browser.close()
    })
    await page.goto(testUrl)
    await delay(1500)
    const dimensions = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })

    await page.setViewport(dimensions)
    setTimeout(async () => {
      await page.close()
    }, 1500)

    return new Promise((resolve, reject) => {
      browser.on('disconnected', () => {
        return resolve({
          window: {
            width: windowWidth,
            height: windowHeight
          },
          viewport: dimensions
        })
      })

      setTimeout(() => {
        reject('测试超时')
      }, 5000)
    })
  })
}
