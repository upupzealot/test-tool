<template>
  <!-- 标题区域 -->
  <div class="detail-container">
    <div class="detail-title">
      <FolderOutlined />
      {{ node.name }}
    </div>
    <a-typography-text
      type="secondary"
      class="desc"
    >
      {{ node.desc }}
    </a-typography-text>
    <a-divider style="margin: 10px 0" />

    <!-- 测试详情 -->
    <div class="detail-content">
      <!-- 步骤选择器 -->
      <div
        class="step-selector-container"
        v-if="node.type === 'group'"
      >
        <StepSelector :group="currentGroupNode" />
      </div>

      <!-- 动作编辑器 -->
      <TestTreeList
        v-if="currentStepId === 'children'"
        class=""
        style="flex: 1; margin-left: -1px"
        :currentNode="currentNode"
        :currentGroup="currentGroupNode"
        @selectNode="onSelectNode"
        @enterGroup="onEnterGroup"
      />
      <div
        class="action-editor-container"
        v-else
      >
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

import { useProjectStore } from '@renderer/store'

import { GroupNode, TestNode } from './types'
import StepSelector from './StepSelector.vue'
import TestTreeList from './TestTreeList.vue'
import ActionEditor from './ActionEditor.vue'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  components: {
    CodeFilled,
    FolderOutlined,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    StepSelector,
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
      currentNode: null
    } as {
      currentNode: TestNode | null
    }
  },
  computed: {
    ...mapState(useProjectStore, ['currentStepId']),
    currentGroupNode(): GroupNode {
      return this.node as GroupNode
    }
  },
  methods: {
    ...mapActions(useProjectStore, ['getNode', 'setCurrentNodeId', 'setCurrentGroupId']),
    async onSelectNode(nodeId: string) {
      // this.setCurrentNodeId(nodeId)
      this.currentNode = this.getNode(nodeId)
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
