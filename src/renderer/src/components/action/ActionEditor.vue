<template>
  <div class="action-editor">
    <!-- 标题部分 -->
    <div class="header">
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
          v-if="actionType !== 'children'"
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

    <!-- 子节点列表 -->
    <TestTreeList
      v-if="node.type === 'group' && actionType === 'children'"
      style="flex: 1; margin-top: -1px"
      :currentNode="childNode"
      :currentGroup="group"
      @selectNode="onSelectNode"
      @enterGroup="onEnterGroup"
    />

    <!-- 编辑器部分 -->
    <div
      v-if="
        node.type === 'case' ||
        (node.type === 'group' && actionType && actionType !== 'children')
      "
      class="operation-container"
    >
      <template v-if="action && action.operations">
        <Operation
          v-for="operation in action?.operations"
          :action="action"
          :operation="operation"
          @delete="onDeleteOperation(operation.id)"
        />
      </template>
      <div class="operation add-btn-panel">
        插入指令：
        <a-tag
          v-for="option in OperationOpts"
          :color="option.color"
          class="add-btn"
          @click="addOperation(option.key)"
        >
          {{ option.label }}
        </a-tag>
      </div>
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
import OperationOpts, { OperationOptMap } from './OperationOpts'
import ActionRunner from './ActionRunner'
import CaseRunner from './CaseRunner'
import GroupRunner from './GroupRunner'
import TestTreeList from '../TestTreeList.vue'
import Operation from './Operation.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: {
    CodeOutlined,
    FolderOutlined,
    RightOutlined,
    DoubleRightOutlined,
    TestTreeList,
    Operation
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
    group() {
      return this.node as GroupNode
    },
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
    },
    addOperation(type: string) {
      let action = this.action
      if (!action) {
        if (this.node.type === 'group') {
          const group = this.node as GroupNode
          action = {
            id: uid.rnd()
          } as Action
          group.test[this.actionType] = action
        } else {
          const kase = this.node as CaseNode
          action = {
            id: uid.rnd()
          } as Action
          kase.test['action'] = action
        }
      }
      if (!action.operations) {
        action.operations = []
      }
      action.operations.push({
        id: uid.rnd(),
        type,
        params: {}
      })
    },
    onDeleteOperation(operationId: string) {
      const { action } = this
      if (!action) {
        return
      }
      action.operations = action.operations.filter(
        (operation) => operation.id !== operationId
      )
    },
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
.action-editor {
  display: flex;
  flex-direction: column;
}

.action-editor .header {
  border: #eee 1px solid;
  padding: 10px 15px;
}
.action-editor .header {
  border: #eee 1px solid;
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.action-editor .header .title {
  flex: 1;
  font-weight: bold;
  font-size: 16px;
}
.action-editor .header .desc {
  font-size: 12px;
}
.action-editor .header .action-btns {
  flex: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  margin-right: -15px;
}
.action-editor .header .action-btns .action-btn:not(:last-child) {
  margin-right: 15px;
}

.action-editor .operation-container {
  border: #eee 1px solid;
  padding: 10px 15px;
  margin-top: -1px;
}
.operation-container .operation {
  position: relative;
  flex: 0;
  border: #eee 1px solid;
  min-height: 46px;
  padding: 30px 20px 10px 10px;
}
.operation-container .operation:not(:first-child) {
  margin-top: -1px;
}
.operation-container .operation.add-btn-panel {
  padding: 10px 15px;
}
.operation-container .operation.add-btn-panel .add-btn {
  cursor: pointer;
}
</style>
