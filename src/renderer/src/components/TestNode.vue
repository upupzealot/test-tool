<template>
  <!-- 标题区域 -->
  <div class="detail-container">
    <div class="detail-title">
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

    <!-- 测试详情 -->
    <div class="detail-content">
      <!-- 步骤选择器 -->
      <div
        class="step-selector-container"
        v-if="node.type === 'group'"
      >
        <StepSelector :group="node as GroupNode" />
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

import { GroupNode, TestNode } from './types'
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
.detail-container {
  border: #eee 1px solid;
  margin-left: -1px;
  padding: 10px 15px;
}

.detail-container .detail-title {
  font-weight: bold;
  font-size: 16px;
}

.detail-container .detail-content {
  display: flex;
  flex-direction: row;
  padding: 5px 0;
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
