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
    const { browserPath, browserBorder } = store
    const { ipcRenderer } = window.electron

    await ipcRenderer.invoke(
      'test-context:project',
      JSON.parse(
        JSON.stringify({
          browserPath,
          browserBorder,
          // TODO projectCtx 在主进程上下文生成
          projectCtx: this.projectCtx
        })
      )
    )
  }

  async close() {
    const { ipcRenderer } = window.electron
    await ipcRenderer.invoke('test-close')
  }

  abstract run(): Promise<boolean>
}
