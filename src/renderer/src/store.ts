import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    filePath: '',
    project: {
      name: ''
    }
  }),
  actions: {
    setPath(filePath) {
      this.filePath = filePath
    },
    setProject(project) {
      this.project = project
    }
  }
})
