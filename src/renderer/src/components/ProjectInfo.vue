<template>
  <ProjectForm
    ref="projectForm"
    :form="projectForm"
    :file-path="filePath"
  />
  <a-button
    type="primary"
    style="float: right"
    @click="saveProject"
  >
    保存
  </a-button>
</template>

<script lang="ts">
import _ from 'lodash'
import { toRaw } from 'vue'
import { mapState } from 'pinia'

import { useProjectStore } from '../store'
import ProjectForm from './ProjectForm.vue'

export default {
  components: { ProjectForm },
  data() {
    const projectStore = useProjectStore()

    return {
      projectStore,
      projectForm: {
        name: '',
        tests: []
      }
    }
  },
  computed: {
    ...mapState(useProjectStore, ['filePath', 'project'])
  },
  watch: {
    projectStore: {
      deep: true,
      immediate: true,
      handler() {
        this.projectForm = _.cloneDeep(toRaw(this.projectStore.project))
      }
    }
  },
  methods: {
    async saveProject() {
      const projectForm = this.$refs['projectForm'] as typeof ProjectForm
      const projectObj = await projectForm.validate()
      if (this.filePath && projectObj) {
        this.projectStore.setProject(projectObj)
        const { ipcRenderer } = window.electron
        await ipcRenderer.invoke('update-project-file', this.filePath, projectObj)
      }
    }
  }
}
</script>
