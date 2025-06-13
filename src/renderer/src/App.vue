<template>
  <div class="root">
    <div class="header" :style="{ fontSize }">
      <span v-if="project.name"><FileOutlined /> {{ project.name }}</span>
      <a-button type="link" @click="openProjectFile"><FolderOpenOutlined /></a-button>
      <a-button type="link"><PlusOutlined /></a-button>

      <a-button type="link" style="float: right"><SettingOutlined />Settings</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { theme } from 'ant-design-vue'
import {
  FileOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

import { mapState, mapActions } from 'pinia'
import { useProjectStore } from './store.ts'

export default {
  components: { FileOutlined, FolderOpenOutlined, PlusOutlined, SettingOutlined },
  data() {
    const seed = theme.defaultSeed
    const projectStore = useProjectStore()

    return {
      fontSize: `${seed.fontSize}px`,
      projectStore
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
      this.loadProject(projectObj)
    }
  }
}
</script>

<style lang="css" scoped>
.root {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
}
.header {
  flex: 0;
  padding: 10px;
  background-color: aliceblue;
}
</style>
