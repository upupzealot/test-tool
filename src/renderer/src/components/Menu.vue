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
      <a-form
        ref="createProjectForm"
        :model="projectForm"
        name="basic"
        :label-col="{ style: { width: '80px' } }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          label="项目名称"
          name="name"
          :rules="[{ required: true, message: '请输入项目名称!' }]"
        >
          <a-input v-model:value="projectForm.name" />
        </a-form-item>
      </a-form>
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

    <a-button
      type="link"
      style="float: right"
      ><SettingOutlined />Settings</a-button
    >
  </div>
</template>

<script lang="ts">
import { toRaw } from 'vue'
import { theme, Form } from 'ant-design-vue'
import { FolderOpenOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons-vue'

import { mapState, mapActions } from 'pinia'
import { useProjectStore } from '../store'

export default {
  components: { FolderOpenOutlined, PlusOutlined, SettingOutlined },
  data() {
    const seed = theme.defaultSeed
    console.log(theme.defaultAlgorithm(seed))
    const projectStore = useProjectStore()

    return {
      fontSize: `${seed.fontSize}px`,
      projectStore,
      createProjectModalVisible: false,
      projectForm: {
        name: ''
      },
      projectFormLoading: false
    }
  },
  computed: {
    ...mapState(useProjectStore, ['project'])
  },
  methods: {
    ...mapActions(useProjectStore, ['loadProject']),
    async openProjectFile() {
      const { ipcRenderer } = window.electron
      const projectObj = await ipcRenderer.invoke('open-project-file')
      if (projectObj) {
        this.loadProject(projectObj)
      }
    },
    async createProject() {
      this.projectForm = { name: '' }
      this.createProjectModalVisible = true
    },
    async onCancel() {
      this.createProjectModalVisible = false
    },
    async onSubmit() {
      const createForm = this.$refs['createProjectForm'] as typeof Form
      try {
        await createForm.validate()

        const projectObj = toRaw(this.projectForm)
        const { ipcRenderer } = window.electron
        const res = await ipcRenderer.invoke('save-project-file', projectObj)
        if (res) {
          this.projectStore.loadProject(projectObj)
          this.createProjectModalVisible = false
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
