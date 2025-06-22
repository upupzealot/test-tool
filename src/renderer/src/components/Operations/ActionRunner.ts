import { useProjectStore } from '@renderer/store'

import { Action } from '../types'

export default class ActionRunner {
  action: Action

  constructor(action: Action) {
    this.action = action
  }

  async run(): Promise<boolean> {
    const { operations } = this.action
    let pass = true

    const store = useProjectStore()
    await store.initBrowserSelection()
    const { browserPath } = store
    const { ipcRenderer } = window.electron
    await ipcRenderer.invoke('test-operation--launch', browserPath)

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      try {
        if (operation.type === 'goto') {
          await this.goto(operation.params)
        }
      } catch {
        pass = false
        return pass
      }
    }
    return pass
  }

  async goto(params) {
    const { ipcRenderer } = window.electron
    await ipcRenderer.invoke('test-operation--goto', params.url)
  }
}
