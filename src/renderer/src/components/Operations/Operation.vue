<template>
  <div class="operation">
    <a-tag
      :color="option.color"
      class="operation-tag"
    >
      {{ option.label }}
    </a-tag>
    <ParamsForm :operation="operation" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Operation } from '../types'
import { OperationOptionMap } from './OperationOptions'
import ParamsForm from './ParamsForm.vue'

export default defineComponent({
  components: { ParamsForm },
  props: {
    operation: {
      type: Object as PropType<Operation>,
      required: true
    }
  },
  computed: {
    option() {
      return OperationOptionMap[this.operation.type]
    }
  }
})
</script>

<style lang="css" scoped>
.operation-tag {
  position: absolute;
  top: 0;
  left: 0;
}

.operation form.ant-form {
  margin-bottom: -34px;
}

.operation form.ant-form .ant-form-item:last-child {
  margin-bottom: 10px;
}
</style>
