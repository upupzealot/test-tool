<template>
  <div class="action-execution">
    <div
      v-for="operation in executingAction?.operations"
      class="operation-execution"
    >
      <div>
        <a-tag
          :color="OperationOptMap[operation.type].color"
          class="operation-tag"
        >
          {{ OperationOptMap[operation.type].label }}
        </a-tag>
      </div>

      <div>
        <a-typography-text
          v-if="operation.pass === true"
          type="success"
          class="desc"
        >
          <CheckCircleOutlined /> 通过
        </a-typography-text>
        <a-typography-text
          v-else-if="operation.pass === false"
          type="danger"
          class="desc"
        >
          <CloseCircleOutlined /> 未通过
        </a-typography-text>
        <a-typography-text
          v-else
          type="secondary"
          class="desc"
        >
          <MinusCircleOutlined /> 等待
        </a-typography-text>

        <a-typography-text
          v-if="operation.time >= 0"
          type="secondary"
          class="desc"
          style="margin-left: 5px"
        >
          用时: {{ operation.time }} ms
        </a-typography-text>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { useProjectStore } from '@renderer/store'
import { ActionExecution } from './types'
import { OperationOptMap } from '../action/OperationOpts'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
  components: { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined },
  data() {
    return {
      OperationOptMap
    }
  },
  computed: {
    ...mapState(useProjectStore, ['executingAction']),
    action() {
      return this.executingAction as ActionExecution
    }
  }
})
</script>

<style lang="css" scoped>
.action-execution {
  border: #eee 1px solid;
  padding: 10px 15px;
}

.operation-execution {
  border: #eee 1px solid;
  padding: 10px 15px;
}
.operation-execution:not(:first-child) {
  margin-top: -1px;
}

.operation-execution .desc {
  font-size: 12px;
}
</style>
