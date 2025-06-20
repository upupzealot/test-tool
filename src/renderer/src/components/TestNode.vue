<template>
  <!-- 标题区域 -->
  <div class="container">
    <div class="title">
      <FolderOutlined />
      {{ test.name }}
    </div>
    <a-typography-text
      type="secondary"
      class="desc"
    >
      {{ test.desc }}
    </a-typography-text>
    <a-divider style="margin: 10px 0" />

    <!-- 测试组侧边栏 -->
    <div style="display: flex; flex-direction: row; padding: 5px 0">
      <!-- 步骤选择器 -->
      <div class="step-selector-container">
        <StepSelector :node="node" />
      </div>

      <!-- 动作编辑器 -->
      <div class="action-editor-container">
        <ActionEditor />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  CodeFilled,
  FolderOutlined,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { TestNode } from './types'
import StepSelector from './StepSelector.vue'
import ActionEditor from './ActionEditor.vue'

export default defineComponent({
  components: {
    CodeFilled,
    FolderOutlined,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    StepSelector,
    ActionEditor
  },
  props: {
    node: {
      type: Object as PropType<TestNode>,
      required: true
    }
  },
  computed: {
    test() {
      return this.node.test
    }
  }
})
</script>

<style lang="css" scoped>
.container {
  border: #eee 1px solid;
  margin-left: -1px;
  padding: 10px 15px;
}

.container .title {
  font-weight: bold;
  font-size: 16px;
}

.step-selector-container {
  flex: 0;
}

.action-editor-container {
  flex: 1;
  border: #eee 1px solid;
  margin-left: -1px;
  padding: 10px 15px;
}
</style>
