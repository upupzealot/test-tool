<template>
  <a-form
    ref="paramsForm"
    :model="operation.params"
    size="small"
  >
    <a-form-item
      label="元素"
      name="locator"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.locator" />
    </a-form-item>

    <a-form-item
      label="获取属性"
      name="attribute"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-select v-model:value="operation.params.attribute">
        <a-select-option value="count">数量</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="存至变量"
      name="output"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.output" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import _Mixin from './_Mixin.vue'
export default {
  mixins: [_Mixin]
}
</script>
