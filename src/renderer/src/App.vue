<template>
  <div class="root">
    <HeaderMenu class="header" />
    <div class="content">
      <a-tabs
        v-model:activeKey="activeTab"
        size="small"
        v-if="project && project.name"
        style="flex: 1"
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
import { mapActions, mapState } from 'pinia'
import { useProjectStore } from './store'

import { message } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import HeaderMenu from './components/project/Menu.vue'
import ProjectInfo from './components/project/ProjectInfo.vue'
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
  },
  mounted() {
    document.onkeydown = async (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        try {
          await this.saveProject()
          message.success('保存成功')
        } catch (err) {
          message.error('保存失败')
          console.error(err)
        }
      }
    }
  },
  methods: {
    ...mapActions(useProjectStore, ['saveProject'])
  }
}
</script>
<style lang="css"></style>
<style lang="css" scoped>
.root {
  display: flex;
  flex-direction: column;
}
.header {
  flex: 0;
}
.content {
  flex: 1;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
}
</style>
