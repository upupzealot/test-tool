import fs from 'fs-extra'
import { dialog } from 'electron'
import puppeteer, { Browser, Page } from 'puppeteer-core'

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

  let browser: Browser
  let page: Page
  let variables = {}
  ipcMain.handle('test-operation--launch', async (__, ...args) => {
    const [browserPath] = args

    const windowWidth = 640
    const windowHeight = 640
    browser = await puppeteer.launch({
      headless: false,
      executablePath: browserPath,
      defaultViewport: null,
      args: [`--window-size=${windowWidth},${windowHeight}`]
    })
    page = (await browser.pages())[0]
  })
  ipcMain.handle('test-operation--close', async () => {
    await browser.close()
  })

  ipcMain.handle('test-operation--goto', async (__, ...args) => {
    const [{ url }] = args
    await page.goto(url)
    return { pass: true }
  })
  ipcMain.handle('test-operation--input', async (__, ...args) => {
    const [{ locator, text }] = args
    const count = await page.$$eval(locator, async ($elements) => {
      return $elements.length
    })
    if (count === 1) {
      // ;($elements[0] as HTMLInputElement).value = text
      await page.type(locator, text)
      return { pass: true }
    } else {
      return { pass: false, message: '匹配不唯一' }
    }
  })
  ipcMain.handle('test-operation--click', async (__, ...args) => {
    const [{ selectorPreset, selector, textOpt, text }] = args
    let query = selector
    if (selectorPreset !== 'custom') {
      // TODO
    }
    const result = await page.$$eval(
      query,
      async ($elements, textOpt, text) => {
        const $target = $elements.filter(($el) => {
          const value = $el.textContent?.trim()
          if (textOpt === 'equals') {
            return value === text
          } else if (textOpt === 'includes') {
            return value?.includes(text)
          } else if (textOpt === 'startsWith') {
            return value?.startsWith(text)
          } else if (textOpt === 'endsWith') {
            return value?.endsWith(text)
          } else {
            return false
          }
        })

        if ($target.length === 1) {
          ;($target[0] as HTMLElement).click()
          return { pass: true }
        } else {
          return { pass: false, message: '匹配不唯一' }
        }
      },
      textOpt,
      text
    )

    return result
  })
  ipcMain.handle('test-operation--lookup', async (__, ...args) => {
    const [{ locator, attribute, output }] = args
    const value = await page.$$eval(
      locator,
      ($elements, attribute) => {
        if (attribute === 'count') {
          return $elements.length
        }
      },
      attribute
    )
    variables[output] = value
    return { pass: true, variables }
  })
  ipcMain.handle('test-operation--lookup:page', async (__, ...args) => {
    const [{ attribute, output }] = args
    const value = await page.evaluate((attribute) => {
      if (attribute === 'url') {
        return window.location.href
      } else if (attribute === 'title') {
        return document.title
      } else {
        return undefined
      }
    }, attribute)
    if (value) {
      variables[output] = value
    }
    return { pass: true, variables }
  })
  ipcMain.handle('test-operation--assert', async (__, ...args) => {
    const [{ variable, compareOpt, num }] = args
    const value = variables[variable]
    if (compareOpt === '=') {
      return { pass: value === num }
    } else if (compareOpt === '>') {
      return { pass: value > num }
    } else if (compareOpt === '<') {
      return { pass: value < num }
    } else {
      return { pass: false, message: `未识别的比较符号：${compareOpt}` }
    }
  })
  ipcMain.handle('test-operation--assert:text', async (__, ...args) => {
    const [{ variable, textOpt, text }] = args
    const value = variables[variable] as string
    if (textOpt === 'equals') {
      return { pass: value === text }
    } else if (textOpt === 'includes') {
      return { pass: value.includes(text) }
    } else if (textOpt === 'startsWith') {
      return { pass: value.startsWith(text) }
    } else if (textOpt === 'endsWith') {
      return { pass: value.endsWith(text) }
    } else {
      return { pass: false, message: `未识别的比较符号：${textOpt}` }
    }
  })
}
