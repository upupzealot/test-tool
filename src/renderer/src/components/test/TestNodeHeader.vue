<template>
  <div class="node-header">
    <div class="info">
      <div class="title">
        <FolderOutlined v-if="node.type === 'group'" />
        <CodeOutlined v-if="node.type === 'case'" />
        {{ node.name }}
      </div>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        {{ node.desc }}
      </a-typography-text>
    </div>

    <div class="action-btns">
      <!-- 单体运行 -->
      <a-button
        v-if="node.type === 'case' || actionType !== 'children'"
        shape="circle"
        size="large"
        class="action-btn"
        :loading="running"
        :disabled="!action?.operations.length"
        @click="onExecuteAction"
      >
        <template #icon>
          <RightOutlined />
        </template>
      </a-button>

      <!-- 连 hooks 上下文运行 -->
      <a-button
        shape="circle"
        size="large"
        class="action-btn"
        :loading="running"
        :disabled="!(action?.operations.length || actionType === 'children')"
        @click="onExecuteNode"
      >
        <template #icon>
          <DoubleRightOutlined />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import {
  CodeOutlined,
  FolderOutlined,
  RightOutlined,
  DoubleRightOutlined
} from '@ant-design/icons-vue'
import { VueDraggable } from 'vue-draggable-plus'

import { useProjectStore } from '@renderer/store/project'
import { useStateStore } from '@renderer/store/state'
import { useExecutionStore } from '@renderer/store/execution'
import {
  Action,
  CaseNode,
  GroupNode,
  ActionType,
  TestCase,
  TestGroup,
  TestNode
} from '../types'
import OperationOpts, { OperationOptMap } from '../action/OperationOpts'
import ActionRunner from '../action/ActionRunner'
import CaseRunner from '../action/CaseRunner'
import GroupRunner from '../action/GroupRunner'
import TestTreeList from './TestTreeList.vue'

export default defineComponent({
  components: {
    CodeOutlined,
    FolderOutlined,
    RightOutlined,
    DoubleRightOutlined,
    TestTreeList,
    VueDraggable
  },
  props: {
    node: {
      type: Object as PropType<TestNode>,
      required: true
    },
    actionType: {
      type: String as PropType<ActionType>,
      required: true
    }
  },
  data() {
    return {
      childNode: null as TestNode | null,
      OperationOpts,
      OperationOptMap,
      running: false
    }
  },
  computed: {
    ...mapState(useProjectStore, ['project']),
    ...mapState(useStateStore, ['currentNode', 'currentGroupNode', 'currentPaths']),
    ...mapWritableState(useExecutionStore, [
      'mode',
      'executingAction',
      'executingCase',
      'executingGroup'
    ]),
    action(): Action | null {
      if (this.node.type === 'group') {
        if (this.actionType !== 'children') {
          return (this.node.test as TestGroup)[this.actionType]
        } else {
          return null
        }
      } else {
        return (this.node.test as TestCase).action
      }
    }
  },
  methods: {
    ...mapActions(useStateStore, ['setActiveTab']),
    ...mapActions(useExecutionStore, [
      'getActionExecution',
      'getCaseExecution',
      'getGroupExecution'
    ]),
    async onExecuteAction() {
      const { action } = this
      if (!action) {
        return
      }

      this.setActiveTab('test-execution')
      this.mode = 'action'
      const actionExecutionObj = this.getActionExecution(action)
      this.executingAction = actionExecutionObj
      // 传入 this.executingAction 引入响应式
      const runner = new ActionRunner(this.project, this.executingAction)
      this.running = true
      await runner.launch()
      const pass = await runner.run()
      if (pass) {
        await runner.close()
      }
      this.running = false
      console.log('run case:', action)
      console.log('passed:', pass)
    },
    async onExecuteNode() {
      if (!this.currentNode) {
        return
      } else if (this.currentNode?.type === 'case') {
        await this.onExecuteCase()
      } else {
        // type === 'group'
        await this.onExecuteGroup()
      }
    },
    async onExecuteCase() {
      const kaseNode = this.currentNode as CaseNode
      const pathNodes = [...this.currentPaths]
      this.setActiveTab('test-execution')
      this.mode = 'case'
      const kaseExecutionObj = this.getCaseExecution(kaseNode, pathNodes)
      this.executingCase = kaseExecutionObj
      // 传入 this.executingCase 引入响应式
      const runner = new CaseRunner(this.project, this.executingCase)
      this.running = true
      await runner.launch()
      const pass = await runner.run()
      if (pass) {
        await runner.close()
      }
      this.running = false
      console.log('passed:', pass)
    },
    async onExecuteGroup() {
      const groupNode = this.currentNode as GroupNode
      const pathNodes = [...this.currentPaths]
      this.setActiveTab('test-execution')
      this.mode = 'group'
      const groupExecutionObj = this.getGroupExecution(groupNode, pathNodes)
      this.executingGroup = groupExecutionObj
      // 传入 this.executingGroup 引入响应式
      const runner = new GroupRunner(this.project, this.executingGroup)
      this.running = true
      await runner.launch()
      const pass = await runner.run()
      if (pass) {
        await runner.close()
      }
      this.running = false
      console.log('passed:', pass)
    }
  }
})
</script>

<style lang="css" scoped>
.node-header {
  border: #eee 1px solid;
  padding: 10px 15px;
  margin-bottom: -1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.node-header .title {
  flex: 1;
  font-weight: bold;
  font-size: 16px;
}
.node-header .desc {
  font-size: 12px;
}
.node-header .action-btns {
  flex: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  margin-right: -15px;
}
.node-header .action-btns .action-btn:not(:last-child) {
  margin-right: 15px;
}
</style>
