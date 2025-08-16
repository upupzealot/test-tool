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
          :value="variable.name"
        >
          <a-typography-text type="secondary">
            [{{ TypeLabel[variable.type] }}]
          </a-typography-text>
          {{ variable.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      v-if="variableType === 'text'"
      label="文本比较"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <div class="locator-item">
        <ItemTextOpt :params="params" />
      </div>
    </a-form-item>

    <a-form-item
      v-if="variableType === 'number'"
      label="数字比较"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <div class="locator-item">
        <ItemNumOpt :params="params" />
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Action } from '@common/types/action'
import _Mixin from './_Mixin.vue'
import OutputTypes, { TypeLabel } from './OutputTypes'
import ItemTextOpt from '../form-items/TextOpt.vue'
import ItemNumOpt from '../form-items/NumOpt.vue'

export default {
  mixins: [_Mixin],
  components: { ItemTextOpt, ItemNumOpt },
  props: {
    action: {
      type: Object as PropType<Action>,
      required: true
    }
  },
  data() {
    return {
      TypeLabel
    }
  },
  computed: {
    variables() {
      const vars: {
        name: string
        type: string
      }[] = []
      for (let i = 0; i < this.action.operations.length; i++) {
        const operation = this.action.operations[i]
        if (operation.id === this.operation.id) {
          break
        }
        if (operation.type === 'lookup' || operation.type === 'lookup:page') {
          const { output } = operation.params
          vars.push({
            name: output,
            type: OutputTypes[`${operation.type}|${operation.params.attribute}`] || 'text'
          })
        }
      }
      return vars
    },
    variableMap() {
      let result: {
        [key: string]: {
          name: string
          type: string
        }
      } = {}
      this.variables.forEach((variable) => {
        result[variable.name] = variable
      })
      return result
    },
    variableType() {
      const input = this.operation.params.variable
      return this.variableMap[input]?.type
    }
  }
}
</script>
