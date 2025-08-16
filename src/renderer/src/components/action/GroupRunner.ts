import ProjectContext from '../project/ProjectContext'
import { CaseExecution, GroupExecution } from '../execution/types'

import Runner from './Runner'
import CaseRunner from './CaseRunner'
import ActionRunner from './ActionRunner'

export default class GroupRunner extends Runner {
  group: GroupExecution

  constructor(projectCtx: ProjectContext, group: GroupExecution) {
    super(projectCtx)
    this.group = group
  }

  async run(): Promise<boolean> {
    let pass = true

    const { beforeActions } = this.group
    for (let i = 0; i < this.group.beforeActions.length; i++) {
      const beforeAction = beforeActions[i]
      const actionRunner = new ActionRunner(this.projectCtx, beforeAction)
      const result = await actionRunner.run()
      pass = pass && result
      if (!pass) {
        // TODO 后续步骤递归标记成 skip
        return false
      }
    }

    for (let i = 0; i < this.group.children.length; i++) {
      const testExecution = this.group.children[i]
      if (testExecution.type === 'case') {
        const caseExecution = testExecution as CaseExecution
        const caseRunner = new CaseRunner(this.projectCtx, caseExecution)
        const result = await caseRunner.run()
        pass = pass && result
        if (!pass) {
          break
        }
      } else {
        // type === 'group'
        const groupExecution = testExecution as GroupExecution
        const groupRunner = new GroupRunner(this.projectCtx, groupExecution)
        const result = await groupRunner.run()
        pass = pass && result
        if (!pass) {
          break
        }
      }
    }

    return pass
  }
}
