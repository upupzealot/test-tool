<template>
  <a-form
    ref="paramsForm"
    :model="operation.params"
    size="small"
  >
    <a-form-item
      v-if="operation.type === 'assert'"
      label="类型"
      name="assertType"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-select
        v-model:value="operation.params.assertType"
        style="min-width: 95px"
      >
        <a-select-option value="elementExist">元素存在</a-select-option>
        <a-select-option value="elementCount">元素数量</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      v-if="operation.type === 'goto'"
      label="URL"
      name="url"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.url" />
    </a-form-item>

    <a-form-item
      v-if="
        operation.type === 'click' ||
        operation.type === 'input' ||
        (operation.type === 'assert' &&
          (operation.params.assertType === 'elementExist' ||
            operation.params.assertType === 'elementCount'))
      "
      label="定位"
      name="locator"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.locator" />
    </a-form-item>

    <a-form-item
      v-if="operation.type === 'input'"
      label="文本"
      name="text"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.text" />
    </a-form-item>

    <a-form-item
      v-if="operation.type === 'assert' && operation.params.assertType === 'elementCount'"
      label="数量"
      name="assertType"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input-number v-model:value="operation.params.count">
        <template #addonBefore>
          <a-select
            v-model:value="operation.params.countCompare"
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
import { defineComponent, PropType } from 'vue'

import { Operation } from '../types'
import { Form } from 'ant-design-vue'

export default defineComponent({
  props: {
    operation: {
      type: Object as PropType<Operation>,
      required: true
    }
  },
  methods: {
    async validate() {
      await (this.$refs['paramsForm'] as typeof Form).validate()
    }
  }
})
</script>

<style lang="css" scoped>
.ant-form-item:last-child {
  margin-bottom: 34px;
}
</style>
