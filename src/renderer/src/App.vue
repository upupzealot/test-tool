<template>
  <div class="root">
    <HeaderMenu class="header" />
    <div class="content">
      <a-tabs
        v-model:activeKey="activeTab"
        size="small"
        v-if="project && project.name"
      >
        <a-tab-pane
          key="project-info"
          tab="基本信息"
        >
          <ProjectInfo />
        </a-tab-pane>
        <a-tab-pane
          key="test-cases"
          tab="测试用例"
        >
          <TestCollection />
        </a-tab-pane>

        <template #rightExtra>
          <a-button
            type="link"
            @click="activeTab = 'settings'"
          >
            <SettingOutlined /> 设置
          </a-button>
        </template>
      </a-tabs>
      <Settings v-if="activeTab === 'settings'" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useProjectStore } from './store'

import { SettingOutlined } from '@ant-design/icons-vue'
import HeaderMenu from './components/Menu.vue'
import ProjectInfo from './components/ProjectInfo.vue'
import TestCollection from './components/TestCollection.vue'
import Settings from './components/Settings.vue'

export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { HeaderMenu, SettingOutlined, ProjectInfo, TestCollection, Settings },
  data() {
    return {
      activeTab: 'test-cases'
    }
  },
  computed: {
    ...mapState(useProjectStore, ['project'])
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
}
.content {
  padding: 0 15px;
}
</style>
