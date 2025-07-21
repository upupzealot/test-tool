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
      <!-- 测试组设置 -->
      <TestSettings
        v-if="node.type === 'group' && currentActionType === 'settings'"
        :currentGroup="currentGroupNode"
      />

      <!-- 子节点列表 -->
      <TestTreeList
        v-if="node.type === 'group' && currentActionType === 'children'"
        :currentNode="childNode"
        :currentGroup="currentGroupNode"
        @selectNode="onSelectNode"
        @enterGroup="onEnterGroup"
      />

      <!-- 动作编辑器 -->
      <ActionEditor
        v-if="
          node.type === 'case' ||
          (node.type === 'group' &&
            currentActionType &&
            currentActionType !== 'settings' &&
            currentActionType !== 'children')
        "
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

import { mapActions, mapState } from 'pinia'
import { useStateStore } from '@renderer/store/state'

import { GroupNode, TestNode } from '../types'
import ActionSelector from './ActionSelector.vue'
import ActionHeader from './TestNodeHeader.vue'
import TestSettings from './TestSettings.vue'
import TestTreeList from './TestTreeList.vue'
import ActionEditor from '../action/ActionEditor.vue'

export default defineComponent({
  components: {
    CodeFilled,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    ActionSelector,
    ActionHeader,
    TestSettings,
    TestTreeList,
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
    ...mapState(useStateStore, ['currentNode', 'currentGroupNode', 'currentActionType']),
    currentGroupNode(): GroupNode {
      return this.node as GroupNode
    }
  },
  methods: {
    ...mapActions(useStateStore, [
      'getNode',
      'setCurrentNodeId',
      'setCurrentGroupId',
      'updateTestTree'
    ]),
    async onSelectNode(nodeId: string) {
      this.childNode = this.getNode(nodeId)
    },
    async onEnterGroup(groupNodeId: string) {
      const group = this.getNode(groupNodeId)
      if (group.type === 'group') {
        this.setCurrentGroupId(groupNodeId)
      }
    }
  }
})
</script>

<style lang="css" scoped>
.detail-content {
  display: flex;
  flex-direction: row;
}

.action-selector-container {
  flex: 0;
  border: #eee 1px solid;
  padding: 10px 15px;

  display: flex;
  flex-direction: column;
}

.action-editor-container {
  flex: 1;
}
.action-editor-container.group {
  margin-left: -1px;
}
</style>
