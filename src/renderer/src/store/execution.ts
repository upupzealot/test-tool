import { defineStore } from 'pinia'

import { CaseNode, GroupNode, TestGroup, TestNode } from '@common/types/test'
import { Action } from '@common/types/action'
import { ActionExecution, CaseExecution, GroupExecution } from '@common/types/execution'

export const useExecutionStore = defineStore('execution', {
  state: () =>
    ({
      // execution
      executing: false,
      mode: 'action',
      executingAction: null,
      executingCase: null,
      executingGroup: null
    }) as {
      executing: boolean
      mode: 'action' | 'case' | 'group'
      executingAction: null | ActionExecution
      executingCase: null | CaseExecution
      executingGroup: null | GroupExecution
    },
  actions: {
    getActionExecution(action: Action): ActionExecution {
      const actionObj = JSON.parse(JSON.stringify(action))
      return actionObj
    },
    getCaseExecution(kaseNode: CaseNode, pathNodes: TestNode[]): CaseExecution {
      const caseExecutionObj = JSON.parse(JSON.stringify(kaseNode.test)) as CaseExecution
      const pathExecutionObjs = pathNodes.map((node) =>
        JSON.parse(JSON.stringify(node))
      ) as GroupNode[]
      caseExecutionObj.beforeEachActions = []
      pathExecutionObjs.forEach((pathNode) => {
        if (pathNode.test.beforeEach) {
          const actionObj = this.getActionExecution(pathNode.test.beforeEach)
          actionObj.nodeId = pathNode.id
          actionObj.nodeName = pathNode.name
          actionObj.nodeDesc = pathNode.desc
          actionObj.type = 'beforeEach'
          caseExecutionObj.beforeEachActions.push(actionObj)
        }
      })
      return caseExecutionObj
    },
    getGroupExecution(
      groupNode: GroupNode,
      pathNodes: TestNode[],
      fistLevel: boolean = true
    ) {
      const groupObj = JSON.parse(JSON.stringify(groupNode.test)) as TestGroup
      const groupExecutionObj = {
        id: groupObj.id,
        type: 'group',
        name: groupObj.name,
        desc: groupObj.desc
      } as GroupExecution
      let pathExecutionObjs: GroupNode[] = fistLevel
        ? pathNodes.map((node) => JSON.parse(JSON.stringify(node)))
        : []
      pathExecutionObjs = [...pathExecutionObjs, groupNode]
      groupExecutionObj.beforeActions = []
      pathExecutionObjs.forEach((pathNode) => {
        if (pathNode.test.before) {
          const actionObj = this.getActionExecution(pathNode.test.before)
          actionObj.nodeId = pathNode.id
          actionObj.nodeName = pathNode.name
          actionObj.nodeDesc = pathNode.desc
          actionObj.type = 'before'
          groupExecutionObj.beforeActions.push(actionObj)
        }
      })
      groupExecutionObj.children = groupNode.children.map((testNode) => {
        const childPathNodes = [...pathNodes, groupNode]
        if (testNode.type === 'case') {
          return this.getCaseExecution(testNode as CaseNode, childPathNodes)
        } else {
          // test.type === 'group'
          return this.getGroupExecution(testNode as GroupNode, childPathNodes, false)
        }
      })
      return groupExecutionObj
    }
  }
})
