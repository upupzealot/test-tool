<template>
  <a-form
    ref="paramsForm"
    :model="operation.params"
    size="small"
  >
    <a-form-item
      label="URL"
      name="url"
      :rules="[{ required: true }]"
      @change="validate"
    >
      <a-input v-model:value="operation.params.url" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import FormMixin from './FormMixin.vue'
export default {
  mixins: [FormMixin]
}
</script>
