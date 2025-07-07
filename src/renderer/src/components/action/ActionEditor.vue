<template>
  <div class="action-editor">
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
        <a-button
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

        <a-button
          shape="circle"
          size="large"
          class="action-btn"
          :loading="running"
          :disabled="!action?.operations.length"
          @click="onExecuteNode"
        >
          <template #icon>
            <DoubleRightOutlined />
          </template>
        </a-button>
      </div>
    </div>
    <div class="operation-container">
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
import { mapActions, mapState } from 'pinia'
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
  StepId,
  TestCase,
  TestGroup,
  TestNode
} from '../types'
import OperationOpts, { OperationOptMap } from './OperationOpts'
import ActionRunner from './ActionRunner'
import CaseRunner from './CaseRunner'
import Operation from './Operation.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: {
    CodeOutlined,
    FolderOutlined,
    RightOutlined,
    DoubleRightOutlined,
    Operation
  },
  props: {
    node: {
      type: Object as PropType<TestNode>,
      required: true
    },
    stepId: {
      type: String as PropType<StepId>,
      required: true
    }
  },
  data() {
    return {
      OperationOpts,
      OperationOptMap,
      running: false
    }
  },
  computed: {
    ...mapState(useProjectStore, ['project']),
    ...mapState(useStateStore, ['currentNode', 'currentPaths']),
    ...mapState(useExecutionStore, ['executingAction', 'executingCase']),
    action(): Action {
      if (this.node.type === 'group') {
        return (this.node.test as TestGroup)[this.stepId]
      } else {
        return (this.node.test as TestCase).action
      }
    }
  },
  methods: {
    ...mapActions(useStateStore, ['setActiveTab']),
    ...mapActions(useExecutionStore, ['executeAction', 'executeCase']),
    addOperation(type: string) {
      let action = this.action
      if (!action) {
        if (this.node.type === 'group') {
          const group = this.node as GroupNode
          action = {
            id: uid.rnd()
          } as Action
          group.test[this.stepId] = action
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
      this.action.operations = this.action.operations.filter(
        (operation) => operation.id !== operationId
      )
    },
    async onExecuteAction() {
      const actionObj = JSON.parse(JSON.stringify(this.action))
      this.setActiveTab('test-execution')
      this.executeAction(actionObj)

      const runner = new ActionRunner(this.project, this.executingAction!)
      this.running = true
      await runner.launch()
      const pass = await runner.run()
      if (pass) {
        await runner.close()
      }
      this.running = false
      console.log('run case:', actionObj)
      console.log('passed:', pass)
    },
    async onExecuteNode() {
      if (this.currentNode?.type === 'case') {
        const kase = this.currentNode.test as TestCase
        const pathNodes = [...this.currentPaths]
        this.executeCase(kase, pathNodes)

        const runner = new CaseRunner(this.project, this.executingCase!)
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
