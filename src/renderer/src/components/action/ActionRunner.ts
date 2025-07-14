import { Project } from '../types'
import { ActionExecution } from '../execution/types'

import Runner from './Runner'

export default class ActionRunner extends Runner {
  action: ActionExecution

  constructor(project: Project, action: ActionExecution) {
    super(project)
    this.action = action
  }

  async run(): Promise<boolean> {
    const { operations } = this.action
    let actionPass = true
    let message

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      const startAt = Date.now()
      try {
        const result = await this.operate(operation.type, operation.params)
        operation.time = Date.now() - startAt
        operation.pass = result.pass

        actionPass = actionPass && result.pass
        if (!result.pass) {
          message = `test${i + 1}(${operation.type}) failed: ${result.message}`
          break
        }
      } catch (err) {
        console.error(err)
        operation.time = Date.now() - startAt
        operation.pass = false
        actionPass = false
        return actionPass
      }
    }

    if (actionPass) {
      console.log('test passed!')
    } else {
      console.error(message)
    }

    return actionPass
  }

  async operate(operationType: string, params: any) {
    const { ipcRenderer } = window.electron
    const paramsObj = JSON.parse(JSON.stringify(params))
    return await ipcRenderer.invoke(`test-operation--${operationType}`, paramsObj)
  }
}
