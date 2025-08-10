<template>
  <a-form
    ref="paramsForm"
    :model="operation.params"
    size="small"
  >
    <a-form-item
      label="窗口名称"
      name="winName"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.winName" />
    </a-form-item>
    <a-form-item
      label="URL"
      name="url"
    >
      <a-input v-model:value="operation.params.url" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import _Mixin from './_Mixin.vue'
export default {
  mixins: [_Mixin]
}
</script>
