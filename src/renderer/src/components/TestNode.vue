<template>
  <div class="detail-content">
    <!-- 步骤选择器 -->
    <div
      class="action-selector-container"
      v-if="node.type === 'group'"
    >
      <ActionSelector :group="currentGroupNode" />
    </div>

    <TestTreeList
      v-if="currentActionType === 'children'"
      style="flex: 1; margin-left: -1px"
      :currentNode="childNode"
      :currentGroup="currentGroupNode"
      @selectNode="onSelectNode"
      @enterGroup="onEnterGroup"
    />
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
import TestTreeList from './TestTreeList.vue'
import ActionEditor from './action/ActionEditor.vue'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  components: {
    CodeFilled,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    ActionSelector,
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
    ...mapState(useStateStore, ['currentNode', 'currentActionType']),
    currentGroupNode(): GroupNode {
      return this.node as GroupNode
    }
  },
  methods: {
    ...mapActions(useStateStore, ['getNode', 'setCurrentNodeId', 'setCurrentGroupId']),
    async onSelectNode(nodeId: string) {
      this.childNode = this.getNode(nodeId)
    },
    async onEnterGroup(groupNodeId: string) {
      const node = this.getNode(groupNodeId)
      const paths = node.paths
      const parentId = paths[paths.length - 2]
      const parentNode = this.getNode(parentId)
      console.log(node.name, parentNode.name)
      if (node.type === 'group') {
        this.setCurrentGroupId(parentId)
        this.setCurrentNodeId(groupNodeId)
      } else {
        this.setCurrentGroupId(parentId)
        this.setCurrentNodeId(groupNodeId)
      }
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
