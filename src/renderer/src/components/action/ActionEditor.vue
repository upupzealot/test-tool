<template>
  <div class="operation-container">
    <template v-if="action && action.operations">
      <VueDraggable
        v-model="action.operations"
        :handle="'.operation-tag'"
      >
        <Operation
          v-for="operation in action.operations"
          :action="action"
          :operation="operation"
          @delete="onDeleteOperation(operation.id)"
        />
      </VueDraggable>
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
import { VueDraggable } from 'vue-draggable-plus'

import { useProjectStore } from '@renderer/store/project'
import { useStateStore } from '@renderer/store/state'
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
import ActionHeader from './ActionHeader.vue'
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
    ActionHeader,
    TestTreeList,
    VueDraggable,
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
    ...mapState(useStateStore, ['currentNode']),
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
    }
  }
})
</script>

<style lang="css" scoped>
.operation-container {
  border: #eee 1px solid;
  padding: 10px 15px;
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
