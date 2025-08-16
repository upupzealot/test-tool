import puppeteer, { Browser } from 'puppeteer-core'

import _ from 'lodash'
import delay from './delay'

export default function init(ipcMain: Electron.IpcMain): void {
  let browserMap: { [key: string]: Browser } = {}
  let browserPath = ''
  async function windowOpening(winId: string) {
    let browser = browserMap[winId]
    if (!browser) {
      const windowWidth = 640
      const windowHeight = 640
      browser = await puppeteer.launch({
        headless: false,
        executablePath: browserPath,
        defaultViewport: null,
        args: [`--window-size=${windowWidth},${windowHeight}`]
      })
      browserMap[winId] = browser
    }
    return browser
  }

  let variables: {
    [key: string]: any
  } = {}

  let presetLocators: {
    [key: string]: {
      key: string
      label: string
      locator: string
    }
  } = {}

  ipcMain.handle('test-operation--init', async (__, ...args) => {
    browserPath = args[0]
    const projectConf = args[1]
    projectConf.presetLocators.forEach((preset) => {
      presetLocators[preset.key] = preset
    })
  })

  ipcMain.handle('test-operation--close', async (__, ...args) => {
    const winIds = _.keys(browserMap)
    await winIds.map(async (winId) => {
      const browser = browserMap[winId]
      await browser.close()
    })
    browserMap = {}
    browserPath = ''
  })
  ipcMain.handle('test-operation--goto', async (__, ...args) => {
    const [winId, { url }] = args
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

    await page.goto(url)
    return { pass: true }
  })
  ipcMain.handle('test-operation--input', async (__, ...args) => {
    const [winId, { locator, text }] = args
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

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
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

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
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

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
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

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
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

    await delay(wait)
    return { pass: true }
  })
  ipcMain.handle('test-operation--assert', async (__, ...args) => {
    const [winId, { variable, numOpt, num, textOpt, text }] = args
    const browser = await windowOpening(winId)
    const page = (await browser.pages())[0]

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
