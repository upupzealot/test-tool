<template>
  <ProjectForm
    ref="projectForm"
    :form="project"
    :file-path="filePath"
  />
  <a-popover
    title="全局保存快捷键"
    placement="leftTop"
  >
    <template #content>
      <p>
        <a-typography-text keyboard>^Ctrl</a-typography-text>+<a-typography-text keyboard
          >S</a-typography-text
        >或<a-typography-text keyboard>⌘Command</a-typography-text>+<a-typography-text
          keyboard
          >S</a-typography-text
        >进行全局保存
      </p>
    </template>
    <a-button
      type="primary"
      style="float: right"
      @click="onSaveProject"
    >
      保存
    </a-button>
  </a-popover>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { message } from 'ant-design-vue'

import { useProjectStore } from '../store'
import ProjectForm from './ProjectForm.vue'

export default {
  components: { ProjectForm },
  computed: {
    ...mapState(useProjectStore, ['filePath', 'project'])
  },
  methods: {
    ...mapActions(useProjectStore, ['saveProject']),
    async onSaveProject() {
      try {
        await this.saveProject()
        message.success('保存成功')
      } catch (err) {
        message.error('保存失败')
        console.error(err)
      }
    }
  }
}
</script>
