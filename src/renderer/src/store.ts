import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    project: {
      name: '',
      location: ''
    }
  }),
  actions: {
    loadProject(project) {
      this.project = project
    }
  }
})
