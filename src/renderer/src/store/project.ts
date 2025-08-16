import { defineStore } from 'pinia'

import { Project } from '@common/types/test'

import { Conf } from 'electron-conf/renderer'
const conf = new Conf()

export const useProjectStore = defineStore('project', {
  state: () =>
    ({
      // project file
      filePath: '',
      project: {
        name: '',
        desc: ''
      }
    }) as {
      filePath: string
      project: Project
    },
  actions: {
    async setPath(filePath: string) {
      this.filePath = filePath
      await conf.set('lastOpen', filePath)
    },
    async getPath() {
      return await conf.get('lastOpen')
    },
    // update project state
    setProject(project: Project) {
      this.project = project
      // this.updateTestTree()
    },
    // persist current project state
    async saveProject() {
      const { ipcRenderer } = window.electron
      const projectObj = JSON.parse(JSON.stringify(this.project))
      await ipcRenderer.invoke('update-project-file', this.filePath, projectObj)
    }
  }
})
