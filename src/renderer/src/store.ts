import { defineStore } from 'pinia'
import { Project } from './components/types'

export const useProjectStore = defineStore('project', {
  state: () =>
    ({
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
    setPath(filePath: string) {
      this.filePath = filePath
    },
    setProject(project: Project) {
      this.project = project
    }
  }
})
