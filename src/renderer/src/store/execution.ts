import { defineStore } from 'pinia'
import { Action, GroupNode, TestCase, TestNode } from '../components/types'
import { ActionExecution, CaseExecution } from '../components/execution/types'

export const useExecutionStore = defineStore('execution', {
  state: () =>
    ({
      // execution
      executing: false,
      mode: 'action',
      executingAction: null,
      executingCase: null
    }) as {
      executing: boolean
      mode: 'action' | 'case' | 'group'
      executingAction: null | ActionExecution
      executingCase: null | CaseExecution
    },
  actions: {
    getActionExecution(action: Action) {
      const actionObj = JSON.parse(JSON.stringify(action))
      return actionObj
    },
    getCaseExecution(kase: TestCase, pathNodes: TestNode[]): CaseExecution {
      const caseExecutionObj = JSON.parse(JSON.stringify(kase)) as CaseExecution
      const pathExecutionObjs = pathNodes.map((node) =>
        JSON.parse(JSON.stringify(node))
      ) as GroupNode[]
      caseExecutionObj.beforeActions = []
      caseExecutionObj.beforeEachActions = []
      pathExecutionObjs.forEach((pathNode) => {
        if (pathNode.test.before) {
          const actionObj = JSON.parse(
            JSON.stringify(pathNode.test.before)
          ) as ActionExecution
          actionObj.nodeId = pathNode.id
          actionObj.nodeName = pathNode.name
          actionObj.nodeDesc = pathNode.desc
          actionObj.type = 'before'
          caseExecutionObj.beforeActions.push(actionObj)
        }
        if (pathNode.test.beforeEach) {
          const actionObj = JSON.parse(
            JSON.stringify(pathNode.test.beforeEach)
          ) as ActionExecution
          actionObj.nodeId = pathNode.id
          actionObj.nodeName = pathNode.name
          actionObj.nodeDesc = pathNode.desc
          actionObj.type = 'beforeEach'
          caseExecutionObj.beforeEachActions.push(actionObj)
        }
      })
      return caseExecutionObj
    }
  }
})
