import { Project } from '../types'
import { CaseExecution, GroupExecution } from '../execution/types'

import Runner from './Runner'
import CaseRunner from './CaseRunner'

export default class GroupRunner extends Runner {
  group: GroupExecution

  constructor(project: Project, group: GroupExecution) {
    super(project)
    this.group = group
  }

  async run(): Promise<boolean> {
    let pass = true
    for (let i = 0; i < this.group.children.length; i++) {
      const testExecution = this.group.children[i]
      if (testExecution.type === 'case') {
        const caseExecution = testExecution as CaseExecution
        const caseRunner = new CaseRunner(this.project, caseExecution)
        const result = await caseRunner.run()
        pass = pass && result
        if (!pass) {
          break
        }
      } else {
        // type === 'group'
        const groupExecution = testExecution as GroupExecution
        const groupRunner = new GroupRunner(this.project, groupExecution)
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
