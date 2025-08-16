<template>
  <div
    v-for="operation in action?.operations"
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons-vue'

import { ActionExecution } from '@common/types/execution'

import { OperationOptMap } from '../action/OperationOpts'

export default defineComponent({
  components: { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined },
  props: {
    action: {
      type: Object as PropType<ActionExecution>,
      required: true
    }
  },
  data() {
    return {
      OperationOptMap
    }
  }
})
</script>

<style lang="css" scoped>
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
