import { useSettingsStore } from '@renderer/store/settings'
import ProjectContext from '../project/ProjectContext'

export default abstract class Runner {
  projectCtx: ProjectContext

  constructor(projectCtx: ProjectContext) {
    this.projectCtx = projectCtx
  }

  async launch() {
    const store = useSettingsStore()
    await store.initBrowserSelection()
    const { browserPath } = store
    const { ipcRenderer } = window.electron

    const { project } = this.projectCtx
    const configObj = JSON.parse(JSON.stringify(project.config))
    await ipcRenderer.invoke('test-operation--init', browserPath, configObj)
  }

  async close() {
    const { ipcRenderer } = window.electron
    await ipcRenderer.invoke('test-operation--close')
  }

  abstract run(): Promise<boolean>
}
