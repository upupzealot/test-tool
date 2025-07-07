import { Project } from '../types'
import { CaseExecution } from '../execution/types'
import { useSettingsStore } from '@renderer/store/settings'
import ActionRunner from './ActionRunner'

export default class CaseRunner {
  project: Project
  kase: CaseExecution

  constructor(project: Project, kase: CaseExecution) {
    this.project = project
    this.kase = kase
  }

  async launch() {
    const store = useSettingsStore()
    await store.initBrowserSelection()
    const { browserPath } = store
    const { ipcRenderer } = window.electron

    const configObj = JSON.parse(JSON.stringify(this.project.config))
    await ipcRenderer.invoke('test-operation--launch', browserPath, configObj)
  }

  async close() {
    const { ipcRenderer } = window.electron
    await ipcRenderer.invoke('test-operation--close')
  }

  async run(): Promise<boolean> {
    const { beforeActions, beforeEachActions, action } = this.kase
    const actionList = [...beforeActions, ...beforeEachActions, action]
    let pass = true
    for (let i = 0; i < actionList.length; i++) {
      const action = actionList[i]
      const actionRunner = new ActionRunner(this.project, action)
      const result = await actionRunner.run()
      pass = pass && result
      if (!pass) {
        break
      }
    }

    return pass
  }
}
