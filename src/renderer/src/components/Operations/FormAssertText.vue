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
      <a-select v-model:value="params.variable">
        <a-select-option
          v-for="variable in variables"
          :value="variable"
        >
          {{ variable }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="文本比较"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <div class="locator-item">
        <ItemTextOpt :params="params" />
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Action } from '../types'
import FormMixin from './FormMixin.vue'
import ItemTextOpt from './ItemTextOpt.vue'

export default {
  mixins: [FormMixin],
  components: { ItemTextOpt },
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
