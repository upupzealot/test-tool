import _ from 'lodash'
import { DEFAULT_SETTINGS, TestSettings } from '../test-settings/types'
import { ActionExecution } from '../execution/types'
import ProjectContext from '../project/ProjectContext'
import Runner from './Runner'

export default class ActionRunner extends Runner {
  action: ActionExecution
  settings: TestSettings

  constructor(projectCtx: ProjectContext, action: ActionExecution) {
    super(projectCtx)
    this.action = action

    const { testNodeMap, testMap, actionMap } = this.projectCtx
    const { testId } = actionMap[action.id]
    const testNode = testNodeMap[testId]
    const pathSettings = [...testNode.paths].map(
      (parentId) => testMap[parentId].settings || {}
    )
    this.settings = _.merge({}, ...[DEFAULT_SETTINGS, ...pathSettings])
  }

  async run(): Promise<boolean> {
    const { operations } = this.action
    let actionPass = true
    let message

    const { ipcRenderer } = window.electron
    const actionCtx = JSON.parse(
      JSON.stringify({
        action: this.action,
        settings: this.settings
      })
    )
    await ipcRenderer.invoke('test-context:action', actionCtx)

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      const startAt = Date.now()
      try {
        const result = await this.operate(
          operation.winId,
          operation.type,
          operation.params
        )
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

  async operate(winId: string, operationType: string, params: any) {
    const { ipcRenderer } = window.electron
    const paramsObj = JSON.parse(JSON.stringify(params))
    return await ipcRenderer.invoke(`test-operation--${operationType}`, winId, paramsObj)
  }
}
