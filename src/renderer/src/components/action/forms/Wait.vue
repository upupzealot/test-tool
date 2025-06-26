<template>
  <a-form
    ref="paramsForm"
    :model="operation.params"
    size="small"
  >
    <a-form-item
      label="等待"
      name="wait"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input-number v-model:value="operation.params.wait">
        <template #addonAfter>ms</template>
      </a-input-number>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import _Mixin from './_Mixin.vue'
export default {
  mixins: [_Mixin]
}
</script>
