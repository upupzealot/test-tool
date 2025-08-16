import ProjectContext from '../project/ProjectContext'
import { CaseExecution } from '../execution/types'

import Runner from './Runner'
import ActionRunner from './ActionRunner'

export default class CaseRunner extends Runner {
  kase: CaseExecution

  constructor(projectCtx: ProjectContext, kase: CaseExecution) {
    super(projectCtx)
    this.kase = kase
  }

  async run(): Promise<boolean> {
    const { beforeEachActions, action } = this.kase
    const actionList = [...beforeEachActions, action]
    let pass = true
    for (let i = 0; i < actionList.length; i++) {
      const action = actionList[i]
      const actionRunner = new ActionRunner(this.projectCtx, action)
      const result = await actionRunner.run()
      pass = pass && result
      if (!pass) {
        break
      }
    }

    return pass
  }
}
