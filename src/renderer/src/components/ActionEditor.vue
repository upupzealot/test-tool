<template>
  <div class="operation-container">
    <template v-if="action && action.operations">
      <Operation
        v-for="operation in action?.operations"
        :operation="operation"
      />
    </template>
    <div
      class="operation"
      style="padding-left: 15px"
    >
      插入指令：
      <a-tag
        v-for="option in OperationOptions"
        :color="option.color"
        class="add-btn"
        @click="addOperation(option.key)"
      >
        {{ option.label }}
      </a-tag>
    </div>

    <div v-if="!(action && action.operations)">
      <div>{{ node?.name }}</div>
      <div>{{ stepId }}</div>
      <div>{{ !!action }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import {
  Action,
  CaseNode,
  GroupNode,
  StepId,
  TestCase,
  TestGroup,
  TestNode
} from './types'
import OperationOptions, { OperationOptionMap } from './Operations/OperationOptions'
import Operation from './Operations/Operation.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: { Operation },
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
      OperationOptions,
      OperationOptionMap
    }
  },
  computed: {
    action(): Action | undefined {
      if (this.node.type === 'group') {
        return (this.node.test as TestGroup)[this.stepId]
      } else {
        return (this.node.test as TestCase).action
      }
    }
  },
  methods: {
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
    }
  }
})
</script>

<style lang="css" scoped>
.operation-container {
  display: flex;
  flex-direction: column;
}
.operation {
  position: relative;
  flex: 0;
  border: #eee 1px solid;
  min-height: 46px;
  padding: 10px 15px 10px 44px;
}
.operation:not(:first-child) {
  margin-top: -1px;
}
.operation-container .add-btn {
  cursor: pointer;
}
</style>
