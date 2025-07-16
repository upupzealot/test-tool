<template>
  <div class="detail-content">
    <!-- 步骤选择器 -->
    <div
      class="action-selector-container"
      v-if="node.type === 'group'"
    >
      <ActionSelector :group="currentGroupNode" />
    </div>

    <!-- 动作编辑器 -->
    <div
      :class="
        currentNode?.type === 'group'
          ? ['action-editor-container', 'group']
          : ['action-editor-container']
      "
    >
      <ActionEditor
        :node="currentNode!"
        :actionType="currentActionType"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  CodeFilled,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { useStateStore } from '@renderer/store/state'

import { GroupNode, TestNode } from './types'
import ActionSelector from './ActionSelector.vue'
import ActionEditor from './action/ActionEditor.vue'
import { mapState } from 'pinia'

export default defineComponent({
  components: {
    CodeFilled,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    ActionSelector,
    ActionEditor
  },
  props: {
    node: {
      type: Object as PropType<TestNode>,
      required: true
    }
  },
  data() {
    return {
      childNode: null
    } as {
      childNode: TestNode | null
    }
  },
  computed: {
    ...mapState(useStateStore, ['currentNode', 'currentActionType']),
    currentGroupNode(): GroupNode {
      return this.node as GroupNode
    }
  }
})
</script>

<style lang="css" scoped>
.detail-content {
  display: flex;
  flex-direction: row;
  margin-left: -1px;
}

.action-selector-container {
  flex: 0;
  border: #eee 1px solid;
  padding: 10px 15px;
}

.action-editor-container {
  flex: 1;
}
.action-editor-container.group {
  margin-left: -1px;
}
</style>
