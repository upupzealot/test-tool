import _ from 'lodash'
import delay from './delay'
import puppeteer, { Browser, KnownDevices } from 'puppeteer-core'

import { Dimension } from '@common/types/test'
import { TestSettings, TestWindow } from '@common/types/test-settings'
import { ActionExecution } from '@common/types/execution'
import ProjectContext from '@common/ProjectContext'

const iPhone = KnownDevices['iPhone 14 Pro']
const mobileViewport: Dimension = iPhone.viewport
const desktopViewport: Dimension = {
  width: 640,
  height: 640
}

export default function init(ipcMain: Electron.IpcMain): void {
  let browserPath: string = ''
  let browserBorder = {} as Dimension
  let projectCtx: ProjectContext
  let presetLocators: {
    [key: string]: {
      key: string
      label: string
      locator: string
    }
  } = {}

  ipcMain.handle('test-context:project', async (__, ...args) => {
    if (args[0].browserPath) {
      browserPath = args[0].browserPath
    }
    if (!browserBorder) {
      browserBorder = args[0].browserBorder || { width: 0, height: 0 }
    } else if (args[0].browserBorder) {
      browserBorder = args[0].browserBorder
    }

    if (args[0].projectCtx) {
      projectCtx = args[0].projectCtx
      const projectConf = projectCtx.project.config
      projectConf.presetLocators.forEach((preset) => {
        presetLocators[preset.key] = preset
      })
    }
  })

  let actionCtx: { action: ActionExecution; settings: TestSettings }
  let windowMap: { [key: string]: TestWindow } = {}
  ipcMain.handle('test-context:action', async (__, ...args) => {
    ;[actionCtx] = args
    windowMap = actionCtx.settings.windows || {}
  })

  let browserMap: { [key: string]: Browser } = {}
  async function getPage(winId: string) {
    const window = windowMap[winId]

    let browser = browserMap[winId]
    if (!browser) {
      const dimention = window.mode === 'mobile' ? mobileViewport : desktopViewport

      const windowWidth = dimention.width + (browserBorder?.width || 0)
      const windowHeight = dimention.height + (browserBorder?.height || 0)
      browser = await puppeteer.launch({
        headless: false,
        executablePath: browserPath,
        defaultViewport: null,
        args: [`--window-size=${windowWidth},${windowHeight}`]
      })


      browserMap[winId] = browser
    }
    const page = (await browser.pages())[0]

    if (window.mode === 'mobile') {
      await page.emulate(iPhone)
    }

    return page
  }
  ipcMain.handle('test-close', async () => {
    const winIds = _.keys(browserMap)
    await winIds.map(async (winId) => {
      const browser = browserMap[winId]
      await browser.close()
    })

    browserPath = ''
    windowMap = {}
    browserMap = {}
  })

  let variables: {
    [key: string]: any
  } = {}
  ipcMain.handle('test-operation--goto', async (__, ...args) => {
    const [winId, { url }] = args
    const page = await getPage(winId)

    await page.goto(url)
    return { pass: true }
  })
  ipcMain.handle('test-operation--input', async (__, ...args) => {
    const [winId, { locator, text }] = args
    const page = await getPage(winId)

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
    const [winId, { selectorPreset, selector, textOpt, text }] = args
    const page = await getPage(winId)

    let query = selector
    if (selectorPreset !== 'custom') {
      query = presetLocators[selectorPreset].locator
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
    const [winId, { locator, attribute, output }] = args
    const page = await getPage(winId)

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
    const [winId, { attribute, output }] = args
    const page = await getPage(winId)

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
  ipcMain.handle('test-operation--wait', async (__, ...args) => {
    const [winId, { wait }] = args
    const page = await getPage(winId)

    await delay(wait)
    return { pass: true }
  })
  ipcMain.handle('test-operation--assert', async (__, ...args) => {
    const [_, { variable, numOpt, num, textOpt, text }] = args

    const value = variables[variable]
    console.log(value, text)
    if (numOpt) {
      if (numOpt === '=') {
        return { pass: value === num }
      } else if (numOpt === '>') {
        return { pass: value > num }
      } else if (numOpt === '>=') {
        return { pass: value >= num }
      } else if (numOpt === '<') {
        return { pass: value < num }
      } else if (numOpt === '<=') {
        return { pass: value <= num }
      } else {
        return { pass: false, message: `未识别的比较符号：${numOpt}` }
      }
    } else if (textOpt) {
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
    } else {
      return { pass: false, message: '未识别的比较类型' }
    }
  })
}
