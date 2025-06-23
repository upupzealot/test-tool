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
  </a-form>
</template>

<script lang="ts">
import FormMixin from './FormMixin.vue'
export default {
  mixins: [FormMixin]
}
</script>
