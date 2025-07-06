import { defineStore } from 'pinia'
import { GroupNode, TestCase, TestNode } from '../components/types'
import { ActionExecution, CaseExecution } from '../components/execution/types'

export const useExecutionStore = defineStore('execution', {
  state: () =>
    ({
      // execution
      executing: false,
      executingAction: null
    }) as {
      executing: boolean
      executingAction: null | ActionExecution
    },
  actions: {
    executeAction(action: ActionExecution) {
      this.executingAction = action
    },
    executeCase(kase: TestCase, pathNodes: TestNode[]) {
      const caseExecutionObj = JSON.parse(JSON.stringify(kase)) as CaseExecution
      const pathExecutionObjs = pathNodes.map((node) =>
        JSON.parse(JSON.stringify(node))
      ) as GroupNode[]
      caseExecutionObj.beforeActions = []
      caseExecutionObj.beforeEachActions = []
      pathExecutionObjs.forEach((pathNode) => {
        if (pathNode.test.before) {
          caseExecutionObj.beforeActions.push(pathNode.test.before as ActionExecution)
        }
        if (pathNode.test.beforeEach) {
          caseExecutionObj.beforeEachActions.push(
            pathNode.test.beforeEach as ActionExecution
          )
        }
      })
      console.log(11111, caseExecutionObj)
    }
  }
})
