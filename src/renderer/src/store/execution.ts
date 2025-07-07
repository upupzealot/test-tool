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
    executeAction(action: Action) {
      this.mode = 'action'
      const actionObj = JSON.parse(JSON.stringify(action))
      this.executingAction = actionObj
    },
    executeCase(kase: TestCase, pathNodes: TestNode[]) {
      this.mode = 'case'
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
          actionObj.stepId = 'before'
          caseExecutionObj.beforeActions.push(actionObj)
        }
        if (pathNode.test.beforeEach) {
          const actionObj = JSON.parse(
            JSON.stringify(pathNode.test.beforeEach)
          ) as ActionExecution
          actionObj.nodeId = pathNode.id
          actionObj.nodeName = pathNode.name
          actionObj.nodeDesc = pathNode.desc
          actionObj.stepId = 'beforeEach'
          caseExecutionObj.beforeEachActions.push(actionObj)
        }
      })
      this.executingCase = caseExecutionObj
    }
  }
})
