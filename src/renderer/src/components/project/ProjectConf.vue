<template>
  <a-form-item label="预置选择器">
    <a-space-compact
      size="small"
      v-for="preset in form.config.presetLocators"
      style="display: flex; flex-direction: row; margin-bottom: 3px"
    >
      <a-input
        style="flex: 0; min-width: 80px"
        v-model:value="preset.label"
      />
      <a-input
        style="flex: 0; min-width: 80px"
        v-model:value="preset.key"
      />
      <a-input
        style="flex: 1"
        v-model:value="preset.locator"
      />
    </a-space-compact>
    <a-button>+ 添加类型</a-button>
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Project } from '@common/types/test'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<Project>,
      required: true
    }
  }
})
</script>
