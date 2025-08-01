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
import { VueDraggable } from 'vue-draggable-plus'

import { Action } from './types'
import OperationOpts from './OperationOpts'
import Operation from './Operation.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: {
    VueDraggable,
    Operation
  },
  props: {
    action: {
      type: Object as PropType<Action>,
      required: false
    }
  },
  emits: ['addOperation'],
  data() {
    return {
      OperationOpts,
      running: false
    }
  },
  methods: {
    addOperation(type: string) {
      this.$emit('addOperation', {
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
