<template>
  <!-- 标题区域 -->
  <div class="detail-container">
    <div class="detail-title">
      <div class="title">
        <FolderOutlined v-if="node.type === 'group'" />
        <CodeOutlined v-if="node.type === 'case'" />
        {{ node.name }}
        <div>
          <a-typography-text
            type="secondary"
            class="desc"
          >
            {{ node.desc }}
          </a-typography-text>
        </div>
      </div>
      <div
        class="btn"
        v-if="node.type === 'case'"
      >
        <a-button
          shape="circle"
          size="large"
          :loading="running"
          @click="runCase"
        >
          <template #icon>
            <RightOutlined />
          </template>
        </a-button>
      </div>
    </div>

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

      <TestTreeList
        v-if="currentStepId === 'children'"
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
        v-if="
          currentNode?.type === 'case' || (currentStepId && currentStepId !== 'children')
        "
      >
        <ActionEditor
          :node="currentNode!"
          :stepId="currentStepId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  CodeOutlined,
  FolderOutlined,
  RightOutlined,
  CodeFilled,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { useProjectStore } from '@renderer/store'

import { GroupNode, TestCase, TestNode } from './types'
import StepSelector from './StepSelector.vue'
import TestTreeList from './TestTreeList.vue'
import ActionEditor from './ActionEditor.vue'
import { mapActions, mapState } from 'pinia'
import ActionRunner from './Operations/ActionRunner'

export default defineComponent({
  components: {
    CodeOutlined,
    FolderOutlined,
    RightOutlined,
    CodeFilled,
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
      childNode: null,
      running: false
    } as {
      childNode: TestNode | null
      running: boolean
    }
  },
  computed: {
    ...mapState(useProjectStore, ['currentNode', 'currentStepId']),
    currentGroupNode(): GroupNode {
      return this.node as GroupNode
    }
  },
  methods: {
    ...mapActions(useProjectStore, ['getNode', 'setCurrentNodeId', 'setCurrentGroupId']),
    async onSelectNode(nodeId: string) {
      // this.setCurrentNodeId(nodeId)
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
    },
    async runCase() {
      const kase = this.node.test as TestCase
      const runner = new ActionRunner(kase.action)
      const pass = await runner.run()
      console.log('run case:', kase.action.operations)
      console.log('passed:', pass)
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
  display: flex;
  flex-direction: row;
  align-items: center;
}
.detail-container .detail-title .title {
  flex: 1;
  font-weight: bold;
  font-size: 16px;
}
.detail-container .detail-title .btn {
  flex: 0;
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
}
.action-editor-container.group {
  border: #eee 1px solid;
  margin-left: -1px;
  padding: 10px 15px;
}
</style>
