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
    let message

    const store = useProjectStore()
    await store.initBrowserSelection()
    const { browserPath } = store
    const { ipcRenderer } = window.electron
    await ipcRenderer.invoke('test-operation--launch', browserPath)

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      try {
        const result = await this.operate(operation.type, operation.params)
        pass = pass && result.pass
        if (!pass) {
          message = `test${i + 1}(${operation.type}) failed: ${result.message}`
          break
        }
      } catch (err) {
        console.error(err)
        pass = false
        return pass
      }
    }

    if (pass) {
      console.log('test passed!')
      await ipcRenderer.invoke('test-operation--close')
    } else {
      console.log(message)
    }

    return pass
  }

  async operate(operationType: string, params: any) {
    const { ipcRenderer } = window.electron
    const paramsObj = JSON.parse(JSON.stringify(params))
    return await ipcRenderer.invoke(`test-operation--${operationType}`, paramsObj)
  }
}
