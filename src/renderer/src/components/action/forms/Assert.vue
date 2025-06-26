<template>
  <a-form
    ref="paramsForm"
    :model="operation.params"
    size="small"
  >
    <a-form-item
      label="变量"
      name="variable"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-select v-model:value="operation.params.variable">
        <a-select-option
          v-for="variable in variables"
          :value="variable"
        >
          {{ variable }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="数值比较"
      name="num"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input-number v-model:value="operation.params.num">
        <template #addonBefore>
          <a-select
            v-model:value="operation.params.compareOpt"
            style="width: 46px"
          >
            <template #suffixIcon></template>
            <a-select-option value="=">=</a-select-option>
            <a-select-option value=">">></a-select-option>
            <a-select-option value="<"><</a-select-option>
          </a-select>
        </template>
      </a-input-number>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Action } from '../../types'
import _Mixin from './_Mixin.vue'

export default {
  mixins: [_Mixin],
  props: {
    action: {
      type: Object as PropType<Action>,
      required: true
    }
  },
  computed: {
    variables() {
      const vars: string[] = []
      for (let i = 0; i < this.action.operations.length; i++) {
        const operation = this.action.operations[i]
        if (operation.id === this.operation.id) {
          break
        }
        if (operation.type === 'lookup' || operation.type === 'lookup:page') {
          vars.push(operation.params.output)
        }
      }
      return vars
    }
  }
}
</script>
