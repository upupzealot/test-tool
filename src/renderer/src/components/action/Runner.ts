import { useSettingsStore } from '@renderer/store/settings'
import { Project } from '../types'

export default abstract class Runner {
  project: Project

  constructor(project: Project) {
    this.project = project
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

  abstract run(): Promise<boolean>
}
