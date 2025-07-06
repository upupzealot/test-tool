import { Conf } from 'electron-conf/renderer'
const conf = new Conf()

import { defineStore } from 'pinia'
import { Dimension } from '../components/types'

export const useSettingsStore = defineStore('settings', {
  state: () =>
    ({
      // settings
      browserType: 'chromium',
      browserPathMap: {
        chromium: '',
        chrome: ''
      },
      browserBorder: {
        chromium: null,
        chrome: null
      }
    }) as {
      browserType: 'chromium' | 'chrome'
      browserPathMap: {
        chromium: string
        chrome: string
      }
      browserBorder: {
        chromium: null | Dimension
        chrome: null | Dimension
      }
    },
  getters: {
    browserPath(): string {
      return this.browserPathMap[this.browserType]
    }
  },
  actions: {
    async initBrowserSelection() {
      const browserType = await conf.get('browserType')
      this.browserType = (browserType as 'chromium' | 'chrome') || 'chromium'

      const { ipcRenderer } = window.electron
      const browserPathMap = (await ipcRenderer.invoke('get-browser-paths')) as {
        chromium: string
        chrome: string
      }
      let chromiumPath = (await conf.get('chromiumPath')) as string
      let chromePath = (await conf.get('chromePath')) as string
      if (!chromiumPath) {
        chromiumPath = browserPathMap.chromium || ''
        await conf.set('chromiumPath', chromiumPath)
      }
      if (!chromePath) {
        chromePath = browserPathMap.chrome || ''
        await conf.set('chromePath', chromePath)
      }
      this.browserPathMap = {
        chromium: chromiumPath,
        chrome: chromePath
      }

      const chromiumBorderStr = (await conf.get('chromiumBorder')) as string
      const chromeBorderStr = (await conf.get('chromiumBorder')) as string
      const browserBorder = {
        chromium: chromiumBorderStr ? (JSON.parse(chromiumBorderStr) as Dimension) : null,
        chrome: chromeBorderStr ? (JSON.parse(chromeBorderStr) as Dimension) : null
      }
      this.browserBorder = browserBorder
    },
    async setBrowserType(type: 'chromium' | 'chrome') {
      this.browserType = type
      await conf.set('browserType', type)
    },
    async updateBrowserPathMap() {
      const { ipcRenderer } = window.electron
      const browserPathMap = await ipcRenderer.invoke('get-browser-paths')

      await conf.set('chromiumPath', browserPathMap.chromium)
      await conf.set('chromePath', browserPathMap.chrome)
      this.browserPathMap = browserPathMap
    },
    async setBrowserBorder(win: Dimension, viewport: Dimension) {
      const browserBorder = {
        width: win.width - viewport.width,
        height: win.height - viewport.height
      }
      this.browserBorder[this.browserType] = browserBorder

      await conf.set(`${this.browserType}Border`, JSON.stringify(browserBorder))
    }
  }
})
