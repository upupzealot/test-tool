<template>
  <div
    class="menu"
    :style="{ fontSize }"
  >
    <a-button
      type="link"
      @click="openProjectFile"
    >
      <FolderOpenOutlined /> {{ project.name }}
    </a-button>
    <a-button
      type="link"
      @click="createProject"
    >
      <PlusOutlined />
    </a-button>
    <a-modal
      v-model:open="createProjectModalVisible"
      title="新建项目"
    >
      <ProjectForm
        ref="projectForm"
        :form="projectForm"
        mode="create"
      />
      <template #footer>
        <a-button
          key="back"
          @click="onCancel"
        >
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="projectFormLoading"
          @click="onSubmit"
        >
          保存
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Conf } from 'electron-conf/renderer'
const conf = new Conf()

import { theme } from 'ant-design-vue'
import { FolderOpenOutlined, PlusOutlined } from '@ant-design/icons-vue'

import { mapState, mapActions } from 'pinia'
import { useProjectStore } from '../../store'

import ProjectForm from './ProjectForm.vue'
import { Project } from '../types'

export default {
  components: { FolderOpenOutlined, PlusOutlined, ProjectForm },
  data() {
    const seed = theme.defaultSeed
    console.log(theme.defaultAlgorithm(seed))

    return {
      fontSize: `${seed.fontSize}px`,
      createProjectModalVisible: false,
      projectForm: {
        name: '',
        children: []
      } as unknown as Project,
      projectFormLoading: false
    }
  },
  async mounted() {
    const { ipcRenderer } = window.electron
    const lastOpen = await conf.get('lastOpen')
    if (lastOpen) {
      const { filePath, projectObj } = await ipcRenderer.invoke(
        'read-project-file',
        lastOpen
      )
      if (projectObj) {
        await this.setPath(filePath)
        this.setProject(projectObj)
      }
    }
  },
  computed: {
    ...mapState(useProjectStore, ['filePath', 'project'])
  },
  methods: {
    ...mapActions(useProjectStore, ['setPath', 'setProject']),
    async openProjectFile() {
      const { ipcRenderer } = window.electron
      const { filePath, projectObj } = await ipcRenderer.invoke('open-project-file')
      if (projectObj) {
        await this.setPath(filePath)
        this.setProject(projectObj)
      }
    },
    async createProject() {
      this.projectForm = { name: '', desc: '' } as unknown as Project
      this.createProjectModalVisible = true
    },
    async onCancel() {
      this.createProjectModalVisible = false
    },
    async onSubmit() {
      const projectForm = this.$refs['projectForm'] as typeof ProjectForm
      try {
        const projectObj = await projectForm.validate()
        if (projectObj) {
          const { ipcRenderer } = window.electron
          const { filePath } = await ipcRenderer.invoke('create-project-file', projectObj)
          if (filePath) {
            await this.setPath(filePath)
            this.setProject(projectObj)
            this.createProjectModalVisible = false
          }
        }
      } catch (err) {}
    }
  }
}
</script>

<style lang="css" scoped>
.menu {
  height: 46px;
  /* padding: 0 15px; */
  background-color: aliceblue;
  cursor: default;
}
</style>
