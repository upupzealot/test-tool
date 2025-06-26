<template>
  <a-form
    ref="paramsForm"
    :model="params"
    size="small"
  >
    <a-form-item
      label="获取属性"
      name="attribute"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-select v-model:value="params.attribute">
        <a-select-option value="url">页面地址</a-select-option>
        <a-select-option value="title">页面标题</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="存至变量"
      name="output"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="params.output" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import _Mixin from './_Mixin.vue'
export default {
  mixins: [_Mixin]
}
</script>
